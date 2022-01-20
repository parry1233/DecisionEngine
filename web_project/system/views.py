from django.http import JsonResponse
from django.shortcuts import render
from django.http import HttpResponse
from django.http import Http404
from django.views.decorators.csrf import csrf_exempt

from . import static
from .models import Rule, URule, ScoreCardLibrary, ScoreCardPool, VariablePool, DecisionTreeLibrary, DecisionTreePool
import json
from system.InferenceEngine import SCEngine, DTEngine
from system.DBAccess import Setter
from .utility import sint, sfloat

from django.db import transaction
from rest_framework.generics import GenericAPIView
from rest_framework import viewsets
from rest_framework.decorators import api_view

from system.serializers import UserSerializer, DTPSerializer
from system.models import User

def value_transform(kmap):
    # turn kmap to value according to it's datatype, also map kmap id to readable name in k2names
    kmap = {x.replace('r', ''): y for x, y in kmap.items()}
    k2names = {}
    for x in kmap.keys():
        obj = VariablePool.objects.filter(pk=x)
        if(obj.exists()):
            varname = obj.first().name
            k2names |= {x: varname}
            datatype = obj.first().datatype
            cast = {'b': lambda x: x == True,
                    'F': lambda x: float(x), 'I': lambda x: int(x)}
            kmap[x] = cast[datatype](kmap[x])
    kmap = {"r"+x: y for x, y in kmap.items()}
    k2names = {"r"+x: y for x, y in k2names.items()}
    # return (facts for clipspy, variable info for template)
    return kmap, {k2names[x]: y for x, y in kmap.items()}


def index(request):
    SCid = ScoreCardLibrary.objects.all()
    scid_list = {i: rule.name for i, rule in enumerate(SCid)}
    lib = DecisionTreeLibrary.objects.all()
    dtid_list = {i: rule.name for i, rule in enumerate(lib)}
    return render(request, 'home.html', {"scid": scid_list, "dtid": dtid_list})


def ScoreCardList(request):
    rules = ScoreCardLibrary.objects.all()
    strr = ""
    for rule in rules:
        strr += rule.name
    return HttpResponse(strr)


def ScoreCardView(request, id):

    rules = ScoreCardPool.objects.filter(fkey__name=id).all()

    varmap = {"1": 1, "2": 1.5, "3": 50}
    varmap, _ = value_transform(varmap)

    engine = SCEngine.SCE()
    rulelist = [(Rule(rule.rule), rule.score * rule.weight)
                for rule in rules]
    engine.defrule(rulelist)
    engine.assign(varmap)
    score, satisfy = engine.run()
    # retract only variabe used in rule
    kmap, vardata = value_transform(engine.info().varmap)

    ruleresult = []
    for i, rule in enumerate(rules):
        line = {}
        line["Rule"] = i
        line["Ruleinfo"] = f"{Rule(rule.rule).ToString():<50}"
        line["w"] = rule.weight
        line["s"] = rule.score
        line["wxs"] = rule.score*rule.weight
        line["satisfy"] = "pass" if satisfy[i] else "fire"
        ruleresult.append(line)

    SCid = ScoreCardLibrary.objects.all()
    scid_list = {i: rule.name for i, rule in enumerate(SCid)}
    lib = DecisionTreeLibrary.objects.all()
    dtid_list = {i: rule.name for i, rule in enumerate(lib)}

    context = {
        'obj': vardata,
        'rules': ruleresult,
        'total': score,
        "scid": scid_list,
        "dtid": dtid_list
    }

    return render(request, 'ScoreCard.html', context)


def DecisionTreeList(request):
    lib = DecisionTreeLibrary.objects.all()
    strr = []
    for x in lib:
        strr += f"<p>{x.name}</p>"
    return HttpResponse(strr)


def DecisionTreeView(request, id):
    def node(var, x):
        return {"self": x, "other": [], "next": {"var": var, "rules": []}}

    def AppendTo(pname, parent):
        rules = DecisionTreePool.objects.filter(
            fkey__name=id, prev=pname).all()
        for x in rules:
            lst = [x.ToReadable() for x in Rule(x.rule).GetRaw()]
            only_rule = [x.rule for x in lst]
            xname = lst[0].name
            xrule = " and ".join(only_rule)

            new_link = node(None, xrule)
            if x.log != "":
                new_link["other"].append(f"印出{x.log}")
            parent["next"]["var"] = xname
            parent["next"]["rules"].append(new_link)
            AppendTo(x, new_link)
    head = node(None, "start")
    AppendTo(None, head)

    # Calculate
    varmap = {"1": 1, "3": 65, "4": 1, "5": 0, "6": 1, "7": 0,
              "8": 1, "9": 18, "10": True, "11": True, "12": 20, "13": True, "14": False, "15": True}
    varmap, _ = value_transform(varmap)
    engine = DTEngine.DTE()
    rulelist = []

    def IterateThrough(prev, rnext, rlog):
        rules = DecisionTreePool.objects.filter(
            fkey__name=id, prev=prev).all()
        if(rules.exists()):
            for rule in rules:
                r = Rule(rule.rule)
                lnext = rnext.copy() + [r]
                llog = rlog + rule.log
                IterateThrough(rule, lnext, llog)
        else:
            if len(rnext) > 1:
                m = rnext[0].Copy()
                for x in rnext[1:]:
                    m.Concatenate(x)
                rulelist.append((m, rlog))
            elif len(rnext) == 1:
                rulelist.append((rnext[0], rlog))

    IterateThrough(None, list(), "")

    engine.defrule(rulelist)
    engine.assign(varmap)
    logs = engine.run()
    # retract only variabe used in rule
    _, vardata = value_transform(engine.info().varmap)

    SCid = ScoreCardLibrary.objects.all()
    scid_list = {i: rule.name for i, rule in enumerate(SCid)}
    lib = DecisionTreeLibrary.objects.all()
    dtid_list = {i: rule.name for i, rule in enumerate(lib)}

    context = {
        'var_list': vardata,
        'link_list': json.dumps(head, default=vars),
        'log': logs,
        "scid": scid_list,
        "dtid": dtid_list
    }
    return render(request, 'DecisionTree.html', context=context)


def ScoreBoardOperation(request):
    return render(request, 'ScoreBoardOperation.html')


@csrf_exempt
def DBAccess(request):
    if request.method == "POST":
        get = (lambda x: request.POST.get(x))
        if get("category") == "SCB":
            (fkey, rule, weight, score) = (sint(get("fkey")), str(
                get("rule")), sfloat(get("weight")), sfloat(get("score")))
            try:
                if isinstance(fkey, (int)) and rule and isinstance(weight, (float)) and isinstance(score, (float)):
                    x = Rule(rule)
                    (fkey, rule) = (ScoreCardLibrary.objects.filter(
                        pk=fkey).first(), Rule(rule))
                    if fkey is None:
                        raise RuntimeError("fk not exists")
                    # Setter.SC_SaveRule(fkey, rule.Get(), weight, score)
                    return JsonResponse("save", safe=False)
                else:
                    raise RuntimeError(
                        "each field must be filled, weight and score must be int or float")
            except RuntimeError as e:
                return JsonResponse(repr(e), safe=False)

    if request.method == "GET":
        get = (lambda x: request.GET.get(x))
        if get("category") == "SCBLB":
            lst = [str(x) for x in ScoreCardLibrary.objects.all()]
            return JsonResponse("\n".join(lst), safe=False)
        elif get("category") == "SCBPL":
            lst = [str(x) for x in ScoreCardPool.objects.all().order_by("-id")]
            return JsonResponse("\n".join(lst), safe=False)

    return JsonResponse(None, safe=False)


'''Below are View for user API, By using viewsets.ModelViewSet, frontend can do:
    1. GET all by /
    2. GET specific data by /<id>
    3. POST data by /
    4. PUT, DELETE data by /<id>
'''
class UserView(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    #http_method_names = ['get', 'post', 'head']

'''Below are View for decision tree API, frontend can only access GET all data currently'''
class DTPool(GenericAPIView):
    queryset = DecisionTreePool.objects.all()
    serializer_class = DTPSerializer

    #GET api request, return all users
    def get(self, request, *args, **krgs):
        #print(request.data.get('id'))
        decisions = self.get_queryset()
        serializer = self.serializer_class(decisions, many = True)
        data = {'decisions' : serializer.data}
        return JsonResponse(data, safe = False)
    
    '''
    #POST api request, save to SQLite DB then return data, if error return error msg
    def post(self, request, *args, **krgs):
        data = request.data
        try:
            serializer = self.serializer_class(data=data)
            serializer.is_valid(raise_exception=True)
            with transaction.atomic():
                serializer.save()
            data = serializer.data
            #data = {'reached' : True}
        except Exception as e:
            data = {'error' : str(e)}
        return JsonResponse(data)
    '''

class ScoreCard():
    
    @api_view(['GET'])
    def ScoreCardList(request):
        id = request.data.get('name')
        #print(request.data.get('name'))
        
        #? if _id is empty return all
        if not id:
            rules = ScoreCardLibrary.objects.all()
            names = []
            for rule in rules:
                names.append(rule.name)
            context = {'names' : names}
            return JsonResponse(context, safe = False)
        else:
            rules = ScoreCardPool.objects.filter(fkey__name=id).all()

            varmap = {"1": 1, "2": 1.5, "3": 50}
            varmap, _ = value_transform(varmap)

            engine = SCEngine.SCE()
            rulelist = [(Rule(rule.rule), rule.score * rule.weight)
                        for rule in rules]
            engine.defrule(rulelist)
            engine.assign(varmap)
            score, satisfy = engine.run()
            # retract only variabe used in rule
            kmap, vardata = value_transform(engine.info().varmap)

            ruleresult = []
            for i, rule in enumerate(rules):
                line = {}
                line["Rule"] = i
                line["Ruleinfo"] = f"{Rule(rule.rule).ToString():<50}"
                line["w"] = rule.weight
                line["s"] = rule.score
                line["wxs"] = rule.score*rule.weight
                line["satisfy"] = "pass" if satisfy[i] else "fire"
                ruleresult.append(line)

            SCid = ScoreCardLibrary.objects.all()
            scid_list = {i: rule.name for i, rule in enumerate(SCid)}
            lib = DecisionTreeLibrary.objects.all()
            dtid_list = {i: rule.name for i, rule in enumerate(lib)}

            context = {
                'obj': vardata,
                'rules': ruleresult,
                'total': score,
                "scid": scid_list,
                "dtid": dtid_list
            }

            return JsonResponse(context, safe = False)
    
    def ScoreCardView(request, id):
        rules = ScoreCardPool.objects.filter(fkey__name=id).all()

        varmap = {"1": 1, "2": 1.5, "3": 50}
        varmap, _ = value_transform(varmap)

        engine = SCEngine.SCE()
        rulelist = [(Rule(rule.rule), rule.score * rule.weight)
                    for rule in rules]
        engine.defrule(rulelist)
        engine.assign(varmap)
        score, satisfy = engine.run()
        # retract only variabe used in rule
        kmap, vardata = value_transform(engine.info().varmap)

        ruleresult = []
        for i, rule in enumerate(rules):
            line = {}
            line["Rule"] = i
            line["Ruleinfo"] = f"{Rule(rule.rule).ToString():<50}"
            line["w"] = rule.weight
            line["s"] = rule.score
            line["wxs"] = rule.score*rule.weight
            line["satisfy"] = "pass" if satisfy[i] else "fire"
            ruleresult.append(line)

        SCid = ScoreCardLibrary.objects.all()
        scid_list = {i: rule.name for i, rule in enumerate(SCid)}
        lib = DecisionTreeLibrary.objects.all()
        dtid_list = {i: rule.name for i, rule in enumerate(lib)}

        context = {
            'obj': vardata,
            'rules': ruleresult,
            'total': score,
            "scid": scid_list,
            "dtid": dtid_list
        }

        return JsonResponse(context, safe = False)
    
class DecisionTree():
    
    @api_view(['GET'])
    def DecisionTreeList(request):
        id = request.data.get('name')
        
        #? check if name is empty, if empty return all
        if not id:
            lib = DecisionTreeLibrary.objects.all()
            trees = []
            for x in lib:
                trees.append(x.name)
            context = {'Trees' : trees}
            return JsonResponse(context, safe = False)
        else:
            def node(var, x):
                return {"self": x, "other": [], "next": {"var": var, "rules": []}}

            def AppendTo(pname, parent):
                rules = DecisionTreePool.objects.filter(
                    fkey__name=id, prev=pname).all()
                for x in rules:
                    lst = [x.ToReadable() for x in Rule(x.rule).GetRaw()]
                    only_rule = [x.rule for x in lst]
                    xname = lst[0].name
                    xrule = " and ".join(only_rule)

                    new_link = node(None, xrule)
                    if x.log != "":
                        new_link["other"].append(f"印出{x.log}")
                    parent["next"]["var"] = xname
                    parent["next"]["rules"].append(new_link)
                    AppendTo(x, new_link)
            head = node(None, "start")
            AppendTo(None, head)

            # Calculate
            varmap = {"1": 1, "3": 65, "4": 1, "5": 0, "6": 1, "7": 0,
                      "8": 1, "9": 18, "10": True, "11": True, "12": 20, "13": True, "14": False, "15": True}
            varmap, _ = value_transform(varmap)
            engine = DTEngine.DTE()
            rulelist = []

            def IterateThrough(prev, rnext, rlog):
                rules = DecisionTreePool.objects.filter(
                    fkey__name=id, prev=prev).all()
                if(rules.exists()):
                    for rule in rules:
                        r = Rule(rule.rule)
                        lnext = rnext.copy() + [r]
                        llog = rlog + rule.log
                        IterateThrough(rule, lnext, llog)
                else:
                    if len(rnext) > 1:
                        m = rnext[0].Copy()
                        for x in rnext[1:]:
                            m.Concatenate(x)
                        rulelist.append((m, rlog))
                    elif len(rnext) == 1:
                        rulelist.append((rnext[0], rlog))

            IterateThrough(None, list(), "")

            engine.defrule(rulelist)
            engine.assign(varmap)
            logs = engine.run()
            # retract only variabe used in rule
            _, vardata = value_transform(engine.info().varmap)

            SCid = ScoreCardLibrary.objects.all()
            scid_list = {i: rule.name for i, rule in enumerate(SCid)}
            lib = DecisionTreeLibrary.objects.all()
            dtid_list = {i: rule.name for i, rule in enumerate(lib)}

            context = {
                'var_list': vardata,
                #'link_list': json.dumps(head, default=vars),
                'link_list': head,
                'log': logs,
                "scid": scid_list,
                "dtid": dtid_list
            }
            return JsonResponse(context, safe = False)


    def DecisionTreeView(request, id):
        def node(var, x):
            return {"self": x, "other": [], "next": {"var": var, "rules": []}}

        def AppendTo(pname, parent):
            rules = DecisionTreePool.objects.filter(
                fkey__name=id, prev=pname).all()
            for x in rules:
                lst = [x.ToReadable() for x in Rule(x.rule).GetRaw()]
                only_rule = [x.rule for x in lst]
                xname = lst[0].name
                xrule = " and ".join(only_rule)

                new_link = node(None, xrule)
                if x.log != "":
                    new_link["other"].append(f"印出{x.log}")
                parent["next"]["var"] = xname
                parent["next"]["rules"].append(new_link)
                AppendTo(x, new_link)
        head = node(None, "start")
        AppendTo(None, head)

        # Calculate
        varmap = {"1": 1, "3": 65, "4": 1, "5": 0, "6": 1, "7": 0,
                  "8": 1, "9": 18, "10": True, "11": True, "12": 20, "13": True, "14": False, "15": True}
        varmap, _ = value_transform(varmap)
        engine = DTEngine.DTE()
        rulelist = []

        def IterateThrough(prev, rnext, rlog):
            rules = DecisionTreePool.objects.filter(
                fkey__name=id, prev=prev).all()
            if(rules.exists()):
                for rule in rules:
                    r = Rule(rule.rule)
                    lnext = rnext.copy() + [r]
                    llog = rlog + rule.log
                    IterateThrough(rule, lnext, llog)
            else:
                if len(rnext) > 1:
                    m = rnext[0].Copy()
                    for x in rnext[1:]:
                        m.Concatenate(x)
                    rulelist.append((m, rlog))
                elif len(rnext) == 1:
                    rulelist.append((rnext[0], rlog))

        IterateThrough(None, list(), "")

        engine.defrule(rulelist)
        engine.assign(varmap)
        logs = engine.run()
        # retract only variabe used in rule
        _, vardata = value_transform(engine.info().varmap)

        SCid = ScoreCardLibrary.objects.all()
        scid_list = {i: rule.name for i, rule in enumerate(SCid)}
        lib = DecisionTreeLibrary.objects.all()
        dtid_list = {i: rule.name for i, rule in enumerate(lib)}

        context = {
            'var_list': vardata,
            #'link_list': json.dumps(head, default=vars),
            'link_list': head,
            'log': logs,
            "scid": scid_list,
            "dtid": dtid_list
        }
        return JsonResponse(context, safe = False)