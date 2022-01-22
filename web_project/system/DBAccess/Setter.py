from distutils.log import error
from system.models import Rule, URule, ScoreCardLibrary, ScoreCardPool, VariableLibrary, VariablePool, DecisionTreeLibrary, DecisionTreePool
from django.http import JsonResponse
from system.utility import sint, sfloat
from system import static
from system.static import ERRORMSG


def VARLB_Add(name):
    try:
        if name:
            variablelb = VariableLibrary()
            variablelb.name = name
            variablelb.save()
            return JsonResponse(0, safe=False)
        else:
            raise RuntimeError(ERRORMSG[0])
    except RuntimeError as e:
        return JsonResponse(repr(e), safe=False)


def VARLB_Del(id):
    try:
        id = sint(id)
        if id == None:
            raise RuntimeError(ERRORMSG[1])
        obj = VariableLibrary.objects.filter(pk=id).first()
        if obj == None:
            raise RuntimeError(ERRORMSG[2])
        obj.delete()
        return JsonResponse(0, safe=False)
    except RuntimeError as e:
        return JsonResponse(repr(e), safe=False)


def VARLB_Update(id, name):
    try:
        id = sint(id)
        if id == None:
            raise RuntimeError(ERRORMSG[1])
        if not name:
            raise RuntimeError(ERRORMSG[0])
        obj = VariableLibrary.objects.filter(pk=id).first()
        if obj == None:
            raise RuntimeError(ERRORMSG[2])
        obj.name = name
        obj.save()
        return JsonResponse(0, safe=False)
    except RuntimeError as e:
        return JsonResponse(repr(e), safe=False)


def VARPL_Add(fkey, name, datatype):
    (fkey, name, datatype) = (sint(fkey), str(name), str(datatype))
    try:
        if isinstance(fkey, (int)):
            if name:
                if datatype in static.CATAGORY_DICT.keys():
                    varlib = VariableLibrary.objects.filter(pk=fkey).first()
                    if varlib is None:
                        raise RuntimeError(
                            ERRORMSG[3])
                    variablepool = VariablePool()
                    variablepool.fkey = varlib
                    variablepool.name = name
                    variablepool.datatype = datatype
                    variablepool.save()
                    return JsonResponse(0, safe=False)
                else:
                    raise RuntimeError(ERRORMSG[4])
            else:
                raise RuntimeError(ERRORMSG[0])
        else:
            raise RuntimeError(ERRORMSG[6])
    except RuntimeError as e:
        return JsonResponse(repr(e), safe=False)


def VARPL_Del(fkey, id):
    try:
        fkey = sint(fkey)
        if fkey is None:
            raise RuntimeError(ERRORMSG[6])
        varlib = VariableLibrary.objects.filter(pk=fkey).first()
        if varlib is None:
            raise RuntimeError(
                ERRORMSG[3])
        id = sint(id)
        if id is None:
            raise RuntimeError(ERRORMSG[1])
        obj = VariablePool.objects.filter(pk=id).first()
        if obj is None:
            raise RuntimeError(ERRORMSG[2])
        if obj.fkey != varlib:
            raise RuntimeError(ERRORMSG[7])
        obj.delete()
        return JsonResponse(0, safe=False)
    except RuntimeError as e:
        return JsonResponse(repr(e), safe=False)


def VARPL_Update(fkey, id, name, datatype):
    (fkey, id, name, datatype) = (sint(fkey), sint(id), str(name), str(datatype))
    try:
        if fkey is None:
            raise RuntimeError(ERRORMSG[6])
        if id is None:
            raise RuntimeError(ERRORMSG[1])
        if not name:
            raise RuntimeError(ERRORMSG[0])

        varlib = VariableLibrary.objects.filter(pk=fkey).first()
        if varlib is None:
            raise RuntimeError(
                ERRORMSG[3])
        obj = VariablePool.objects.filter(pk=id).first()
        if obj is None:
            raise RuntimeError(ERRORMSG[2])
        if datatype not in static.CATAGORY_DICT.keys():
            raise RuntimeError(ERRORMSG[4])
        if obj.fkey != varlib:
            raise RuntimeError(ERRORMSG[7])
        obj.name = name
        obj.datatype = datatype
        obj.save()
        return JsonResponse(0, safe=False)
    except RuntimeError as e:
        return JsonResponse(repr(e), safe=False)


def SC_SaveRule(fkey, rule, weight, score):
    scoreboard = ScoreCardPool()
    scoreboard.fkey = fkey
    scoreboard.rule = rule
    scoreboard.weight = weight
    scoreboard.score = score
    scoreboard.save()
