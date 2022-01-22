from unicodedata import category
from django.http import JsonResponse
from django.shortcuts import render
from django.http import HttpResponse
from django.http import Http404
from django.views.decorators.csrf import csrf_exempt
from . import static
from .models import Rule, URule, ScoreCardLibrary, ScoreCardPool, VariableLibrary, VariablePool, DecisionTreeLibrary, DecisionTreePool
import json
from system.InferenceEngine import SCEngine, DTEngine
from system.DBAccess import Setter, Getter
from .utility import sint, sfloat


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


def VariableOperation(request):
    return render(request, 'VariableOperation.html')


def ScoreCardOperation(request):
    return render(request, 'ScoreCardOperation.html')


@csrf_exempt
def DBAccess(request):
    # POST method
    if request.method == "POST":
        get = (lambda x: request.POST.get(x))
        category = get("category")
        action = get("action")
        # variable library
        if category == "VARLB":
            if action == "ADD":
                return Setter.VARLB_Add(get("name"))
            elif action == "DEL":
                return Setter.VARLB_Del(get("id"))
            elif action == "UPD":
                return Setter.VARLB_Update(get("id"), get("name"))
        # variable pool
        if category == "VARPL":
            if action == "ADD":
                return Setter.VARPL_Add(get("fk"), get("name"), get("datatype"))
            elif action == "DEL":
                return Setter.VARPL_Del(get("fk"), get("id"))
            elif action == "UPD":
                return Setter.VARPL_Update(get("fk"), get("id"), get("name"), get("datatype"))
        # scorecard library
        if category == "SCLB":
            if action == "ADD":
                return Setter.SCLB_Add(get("name"))
            elif action == "DEL":
                return Setter.SCLB_Del(get("id"))
            elif action == "UPD":
                return Setter.SCLB_Update(get("id"), get("name"))
        if category == "SCPL":
            if action == "ADD":
                return Setter.SCPL_Add(get("fk"), get("rule"), get("weight"), get("score"))
            elif action == "DEL":
                return Setter.SCPL_Del(get("fk"), get("id"))
            elif action == "UPD":
                return Setter.SCPL_Update(get("fk"), get("id"), get("rule"), get("weight"), get("score"))
    # Get method
    if request.method == "GET":
        get = (lambda x: request.GET.get(x))
        category = get("category")
        if category == "VARLB":
            return JsonResponse(Getter.VARLB_Read(), safe=False)
        elif category == "VARPL":
            return JsonResponse(Getter.VARPL_Read(get("id")), safe=False)
        elif category == "DATATYPE":
            return JsonResponse(Getter.DATATYPE_Read(), safe=False)
        elif category == "SCLB":
            return JsonResponse(Getter.SCLB_Read(), safe=False)
        elif category == "SCPL":
            return JsonResponse(Getter.SCPL_Read(get("id")), safe=False)

    return JsonResponse(None, safe=False)
