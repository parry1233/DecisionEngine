from django.shortcuts import render
from django.http import HttpResponse
from django.http import Http404
from . import static
from .models import Rule, URule, ScoreCardLibrary, ScoreCardPool, VariablePool, DecisionTreeLibrary, DecisionTreePool
import json

#for rest
from rest_framework import viewsets
from .serializers import SystemSerializer
from .models import System


class SystemView(viewsets.ModelViewSet):
    serializer_class = SystemSerializer
    queryset = System.objects.all()



def index(request):
    # rules = ScoreCardPool.objects.filter(fkey__name="ScoreCardLib01").all()
    # for rule in rules:
    #     for k in Rule(rule.rule).Load():
    #         print(k)
    return HttpResponse("Hello, world. You're at the lobby.")


def ScoreCardList(request):
    rules = ScoreCardLibrary.objects.all()
    strr = ""
    for rule in rules:
        strr += rule.name
    return HttpResponse(strr)


def ScoreCardView(request, id):
    rules = ScoreCardPool.objects.filter(fkey__name=id).all()
    varmap = {"1": 1, "2": 1.5, "3": 65}
    hashmap = {}
    for x in varmap.keys():
        obj = VariablePool.objects.filter(pk=x)
        if(obj.exists()):
            varname = obj.first().name
            hashmap[varname] = varmap[x]
            datatype = obj.first().datatype
            cast = {'b': lambda x: x == True,
                    'F': lambda x: float(x), 'I': lambda x: int(x)}
            lvalue = cast[datatype](hashmap.get(varname, 0))
    strr = "<pre>"
    total = 0
    satisfy = {}
    for rule in rules:
        weight = rule.weight
        score = rule.score
        for k in Rule(rule.rule).Load():
            obj = VariablePool.objects.filter(pk=k.variable)
            if(obj.exists()):
                datatype = obj.first().datatype
                varname = obj.first().name
                operator = k.operator
                switch = {'b': lambda x, y: x > y, 'e': lambda x,
                          y: x == y, 's': lambda x, y: x < y}
                cast = {'b': lambda x: x == True,
                        'F': lambda x: float(x), 'I': lambda x: int(x)}
                value_cast = {'b': lambda x: str(x).lower() in ("true", "1"),
                              'F': lambda x: float(x), 'I': lambda x: float(x)}
                lvalue = cast[datatype](hashmap.get(varname, 0))
                rvalue = value_cast[datatype](k.value)

                satisfy[rule] = switch[operator](lvalue, rvalue)
                if satisfy[rule] == False:
                    break
        if satisfy[rule]:
            scores = score * weight
            total += scores

    namelist = []
    for rule in rules:
        for k in Rule(rule.rule).Load():
            obj = VariablePool.objects.filter(pk=k.variable)
            if(obj.exists()):
                varname = obj.first().name
                datatype = obj.first().datatype
                lvalue = cast[datatype](hashmap.get(varname, 0))
                if varname not in namelist:
                    strr += f"<p>{varname:<16}={str(lvalue):>6}</p>"
                    namelist.append(varname)
    strr += "<hr>"
    for i, rule in enumerate(rules):
        strr += f'''<p style="color: Tomato">Rule {i:<2}: '''
        strr += f"{Rule(rule.rule).ToString():<50}"
        strr += f" | w: {rule.weight}, s: {rule.score}, wxs: {rule.score*rule.weight:>5}"
        if satisfy[rule] == True:
            strr += f" --> pass"
        else:
            strr += f" --> fire"
        strr += "</p>"

    strr += f"<hr><p>Total score = {total}</p></pre>"
    return HttpResponse(strr)


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
    # else:
    #     raise Http404("Poll does not exist")

    head = node(None, "start")
    AppendTo(None, head)
    # Calculate
    strr = []
    varmap = {"1": 1, "3": 65, "4": 1, "5": 0, "6": 1, "7": 0, "8": 1}
    hashmap = {}
    for x in varmap.keys():
        obj = VariablePool.objects.filter(pk=x)
        if(obj.exists()):
            varname = obj.first().name
            hashmap[varname] = varmap[x]
            datatype = obj.first().datatype
            cast = {'b': lambda x: x == True,
                    'F': lambda x: float(x), 'I': lambda x: int(x)}
            lvalue = cast[datatype](hashmap.get(varname, 0))
            strr.append(f"{varname:<9}={str(lvalue):>6}")
    front = None
    logs = ""
    namelist = []
    while True:
        rules = DecisionTreePool.objects.filter(
            fkey__name=id, prev=front).all()
        if(rules.exists()):
            for rule in rules:
                satisfy = True
                for k in Rule(rule.rule).Load():
                    obj = VariablePool.objects.filter(pk=k.variable)
                    if(obj.exists()):
                        datatype = obj.first().datatype
                        varname = obj.first().name
                        operator = k.operator
                        switch = {'b': lambda x, y: x > y, 'e': lambda x,
                                  y: x == y, 's': lambda x, y: x < y}
                        cast = {'b': lambda x: x == True,
                                'F': lambda x: float(x), 'I': lambda x: int(x)}
                        value_cast = {'b': lambda x: str(x).lower() in ("true", "1"),
                                      'F': lambda x: float(x), 'I': lambda x: float(x)}
                        lvalue = cast[datatype](hashmap.get(varname, 0))
                        rvalue = value_cast[datatype](k.value)
                        satisfy = switch[operator](lvalue, rvalue)
                        if not satisfy:
                            break
                if satisfy:
                    front = rule
                    break
        else:
            log = front.log
            break
    print(head)
    context = {
        'var_list': strr,
        'link_list': json.dumps(head, default=vars),
        'log': log,
    }
    return render(request, 'index.html', context=context)
