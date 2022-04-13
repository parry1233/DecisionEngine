
from rest_framework.decorators import action
from django.http import JsonResponse
from django.shortcuts import render
from django.http import HttpResponse
from django.http import Http404
from django.views.decorators.csrf import csrf_exempt
from . import static
from .models import Rule, Action, RuleSetLibrary, RuleSetPool, URule, ScoreCardLibrary, ScoreCardPool, VariableLibrary, VariablePool, DecisionTreeLibrary, DecisionTreePool
import json
from system.InferenceEngine import SCEngine, DTEngine, RSEngine
from system.DBAccess import Setter, Getter
from . import serializers
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.decorators import api_view


def value_transform(kmap):
    # turn kmap to value according to it's datatype, also map kmap id to readable name in k2names
    # print(kmap)
    kmap = {x.replace('r', ''): y for x, y in kmap.items()}
    k2names = {}
    for x in kmap.keys():
        obj = VariablePool.objects.filter(pk=x)
        if(obj.exists()):
            varname = obj.first().name
            k2names |= {x: varname}
            datatype = obj.first().datatype
            cast = {'b': lambda x: x == True,
                    'F': lambda x: float(x), 'I': lambda x: float(int(x))}
            kmap[x] = cast[datatype](kmap[x])
    kmap = {"r"+x: y for x, y in kmap.items()}
    k2names = {"r"+x: (x, y) for x, y in k2names.items()}
    vardata = {k2names[x][1]: (k2names[x][0], y) for x, y in kmap.items()}

    # return (facts for clipspy, variable info for template)
    return kmap, [{"id": y[0], "name":x, "value":y[1]} for x, y in vardata.items()]


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

    varmap = {"35": 0, "36": 40, "37": 14, "38": 1, "39": 1, "40": -1, "41": 1005, "42": 2, "43": 2, "44": 2, "45": 52, "46": 1, "47": 1,
              "48": 0, "49": 4, "50": 0, "51": 4, "52": 4, "53": 2, "54": 588, "55": 0, "56": 48, "57": 10, "58": 1, "59": 1, "60": 0, "61": 2, "62": 1, "63": 1, "64": 0, "65": 1}
    varmap, _ = value_transform(varmap)
    rules = ScoreCardPool.objects.filter(fkey__name=id).all()
    rulelist = [(Rule(rule.rule), rule.score * rule.weight)
                for rule in rules]

    engine = SCEngine.SCE()
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
        line["satisfy"] = "fired" if satisfy[i] else "refused"
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


@api_view(["POST"])
def DecisionTreeViewJSMindStructure(request):
    get = (lambda x: request.data[x])
    fkey = get("fk")

    idctr = 0

    def JsmindNode(topic, parentid, nodetype=None):
        nonlocal idctr
        idctr = idctr + 1
        node = {"id": str(idctr), "parentid": parentid,
                "topic": topic, "nodetype": nodetype}
        if idctr == 1:
            node["isroot"] = True
        return node

    def JsmindAppendTo(data, pname, parentid):
        rules = DecisionTreePool.objects.filter(
            fkey=fkey, prev=pname).all()

        parent = None
        if len(rules) != 0:
            x = rules[0]
            rule = Rule(x.rule)
            xname = rule.GetRaw()[0].ToReadable().name
            parent = JsmindNode(xname, parentid, "question")
            parent["retype"] = rule.GetRaw()[0].datatype
            data.append(parent)
        for x in rules:
            lst = [x.ToReadable() for x in Rule(x.rule).GetRaw()]
            # print(lst)
            only_rule = [x.rule for x in lst]
            xrule = " and ".join(only_rule)
            child = JsmindNode(xrule, parent["id"], "rule")
            data.append(child)
            if x.log != "":
                data.append(JsmindNode(f"{x.log}", child["id"], "log"))
            JsmindAppendTo(data, x, child["id"])
    jstree = []
    JsmindAppendTo(jstree, None, "")

    SCid = ScoreCardLibrary.objects.all()
    scid_list = {i: rule.name for i, rule in enumerate(SCid)}
    lib = DecisionTreeLibrary.objects.all()
    dtid_list = {i: rule.name for i, rule in enumerate(lib)}

    context = {
        "link_list": {"meta": {}, "format": "node_array", "data": jstree},
        "scid": scid_list,
        "dtid": dtid_list
    }
    return JsonResponse(context, safe=False, json_dumps_params={"ensure_ascii": False})


@api_view(["POST"])
def ScoreCardEngine(request):
    get = (lambda x: request.data[x])
    varmap, _ = value_transform(get("varmap"))
    rules = ScoreCardPool.objects.filter(fkey=get("fk")).all()
    rulelist = [(Rule(rule.rule), rule.score * rule.weight)
                for rule in rules]

    engine = SCEngine.SCE()
    engine.defrule(rulelist)
    engine.assign(varmap)

    score, satisfy = engine.run()

    _, vardata = value_transform(engine.info().varmap)
    return JsonResponse({"total": score, "satisfy": satisfy, "varmap": vardata}, safe=False, json_dumps_params={"ensure_ascii": False})


@api_view(["POST"])
def DecisionTreeEngine(request):
    get = (lambda x: request.data[x])
    varmap, _ = value_transform(get("varmap"))
    engine = DTEngine.DTE()
    rulelist = []
    id = get("fk")

    def IterateThrough(prev, rnext, rlog):
        rules = DecisionTreePool.objects.filter(
            fkey=id, prev=prev).all()
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
    _, vardata = value_transform(engine.info().varmap)
    print(engine.info().varmap)
    return JsonResponse({"log": logs, "varmap": vardata}, safe=False, json_dumps_params={"ensure_ascii": False})


@api_view(["POST"])
def RuleSetEngine(request):
    get = (lambda x: request.data[x])
    varmap, _ = value_transform(get("varmap"))
    rules = RuleSetPool.objects.filter(fkey=get("fk")).all()
    rulelist = [(Rule(rule.rule), Action(rule.action), Action(rule.naction))
                for rule in rules]

    engine = RSEngine.RSE(get("circular"))
    engine.defrule(rulelist)
    engine.assign(varmap)
    log = engine.run()
    _, vardata = value_transform(engine.info().varmap)
    print(vardata)
    return JsonResponse({"log": log, "varmap": vardata}, safe=False, json_dumps_params={"ensure_ascii": False})


@csrf_exempt
def StaticData(request, category):
    if category == "datatype":
        return JsonResponse(static.CATAGORY_DICT, safe=False)
    elif category == "method":
        return JsonResponse(static.METHOD_RDCIT, safe=False)
    return JsonResponse(None, safe=False)


class VariableLibViewSet(viewsets.ModelViewSet):
    queryset = VariableLibrary.objects.all()
    serializer_class = serializers.VariableLibrarySerializer


class VariablePoolViewSet(viewsets.ModelViewSet):
    queryset = VariablePool.objects.all()
    serializer_class = serializers.VariablePoolSerializer

    @action(methods=['get'], detail=False, url_path='link/(?P<fk>\d+)')
    def getListFromFk(self, request, fk):
        serializer = serializers.VariablePoolSerializer(
            VariablePool.objects.filter(fkey__id=fk).all(), many=True)
        return JsonResponse(serializer.data, safe=False, json_dumps_params={"ensure_ascii": False})

    def create(self, validated_data):
        get = (lambda x: validated_data.data[x])
        return Setter.VARPL_Add(get("fk"), get("name"), get("datatype"))

    def update(self, request, pk):
        get = (lambda x: request.data[x])
        return Setter.VARPL_Update(get("fk"), pk, get("name"), get("datatype"))


class ScoreCardLibViewSet(viewsets.ModelViewSet):
    queryset = ScoreCardLibrary.objects.all()
    serializer_class = serializers.ScoreCardLibrarySerializer


class ScoreCardPoolViewSet(viewsets.ModelViewSet):
    queryset = ScoreCardPool.objects.all()
    serializer_class = serializers.ScoreCardPoolSerializer

    @action(methods=['get'], detail=False, url_path='link/(?P<fk>\d+)')
    def getListFromFk(self, request, fk):
        serializer = serializers.ScoreCardPoolSerializer(
            ScoreCardPool.objects.filter(fkey__id=fk).all(), many=True)
        return JsonResponse(serializer.data, safe=False, json_dumps_params={"ensure_ascii": False})

    def create(self, validated_data):
        get = (lambda x: validated_data.data[x])
        return Setter.SCPL_Add(get("fk"), get("rule"), get("weight"), get("score"), get("description"))

    def update(self, request, pk):
        get = (lambda x: request.data[x])
        return Setter.SCPL_Update(get("fk"), pk, get("rule"), get("weight"), get("score"), get("description"))


class DecisionTreeLibViewSet(viewsets.ModelViewSet):
    queryset = DecisionTreeLibrary.objects.all()
    serializer_class = serializers.DecisionTreeLibrarySerializer


class DecisionTreePoolViewSet(viewsets.ModelViewSet):
    queryset = DecisionTreePool.objects.all()

    serializer_class = serializers.DecisionTreePoolSerializer

    @action(methods=['get'], detail=False, url_path='link/(?P<fk>\d+)')
    def getListFromFk(self, request, fk):
        serializer = serializers.DecisionTreePoolSerializer(
            DecisionTreePool.objects.filter(fkey__id=fk).all(), many=True)
        return JsonResponse(serializer.data, safe=False, json_dumps_params={"ensure_ascii": False})


class RuleSetLibViewSet(viewsets.ModelViewSet):
    queryset = RuleSetLibrary.objects.all()
    serializer_class = serializers.RuleSetLibrarySerializer


class RuleSetPoolViewSet(viewsets.ModelViewSet):
    queryset = RuleSetPool.objects.all()
    serializer_class = serializers.RuleSetPoolSerializer

    @action(methods=['get'], detail=False, url_path='link/(?P<fk>\d+)')
    def getListFromFk(self, request, fk):
        serializer = serializers.RuleSetPoolSerializer(
            RuleSetPool.objects.filter(fkey__id=fk).all(), many=True)
        return JsonResponse(serializer.data, safe=False, json_dumps_params={"ensure_ascii": False})

    def create(self, validated_data):
        get = (lambda x: validated_data.data[x])
        return Setter.RSPL_Add(get("fk"), get("rule"), get("action"), get("naction"))

    def update(self, request, pk):
        get = (lambda x: request.data[x])
        return Setter.RSPL_Update(get("fk"), pk, get("rule"), get("action"), get("naction"))
