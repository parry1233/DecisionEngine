from distutils.log import error
from system.models import Rule, Action, ScoreCardLibrary, ScoreCardPool, VariableLibrary, VariablePool, DecisionTreeLibrary, DecisionTreePool, RuleSetLibrary, RuleSetPool
from django.http import JsonResponse
from system.utility import sint, sfloat
from system import static
from system.static import ERRORMSG
from system import serializers

# variable library


# def VARLB_Add(name):
#     try:
#         if not name:
#             raise RuntimeError(ERRORMSG[0])
#         variablelb = VariableLibrary()
#         variablelb.name = name
#         variablelb.save()
#         return JsonResponse(0, safe=False)
#     except RuntimeError as e:
#         return JsonResponse({"error": str(e)}, safe=False)


# def VARLB_Del(id):
#     try:
#         id = sint(id)
#         if id is None:
#             raise RuntimeError(ERRORMSG[1])
#         obj = VariableLibrary.objects.filter(pk=id).first()
#         if obj is None:
#             raise RuntimeError(ERRORMSG[2])
#         obj.delete()
#         return JsonResponse(0, safe=False)
#     except RuntimeError as e:
#         return JsonResponse({"error": str(e)}, safe=False)


# def VARLB_Update(id, name):
#     try:
#         id = sint(id)
#         if id is None:
#             raise RuntimeError(ERRORMSG[1])
#         if not name:
#             raise RuntimeError(ERRORMSG[0])
#         obj = VariableLibrary.objects.filter(pk=id).first()
#         if obj is None:
#             raise RuntimeError(ERRORMSG[2])
#         obj.name = name
#         obj.save()
#         return JsonResponse(0, safe=False)
#     except RuntimeError as e:
#         return JsonResponse({"error": str(e)}, safe=False)

# variable pool

def IntCheck(k, errid):
    k = sint(k)
    if isinstance(k, int):
        return k
    else:
        raise RuntimeError(ERRORMSG[errid])


def FloatCheck(k, errid):
    k = sfloat(k)
    if isinstance(k, int):
        return k
    else:
        raise RuntimeError(ERRORMSG[errid])


def StringCheck(k):
    k = str(k)
    if k:
        return k
    else:
        raise RuntimeError(ERRORMSG[0])


def VARPL_Add(fkey, name, datatype):
    try:
        (fkey, name, datatype) = (
            IntCheck(fkey, 6), StringCheck(name), str(datatype))
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
            return JsonResponse(serializers.VariablePoolSerializer(variablepool).data, safe=False, json_dumps_params={"ensure_ascii": False})
        else:
            raise RuntimeError(ERRORMSG[4])
    except RuntimeError as e:
        return JsonResponse({"error": str(e)}, safe=False)


# def VARPL_Del(fkey, id):
#     try:
#         fkey = sint(fkey)
#         if fkey is None:
#             raise RuntimeError(ERRORMSG[6])
#         varlib = VariableLibrary.objects.filter(pk=fkey).first()
#         if varlib is None:
#             raise RuntimeError(
#                 ERRORMSG[3])
#         id = sint(id)
#         if id is None:
#             raise RuntimeError(ERRORMSG[1])
#         obj = VariablePool.objects.filter(pk=id).first()
#         if obj is None:
#             raise RuntimeError(ERRORMSG[2])
#         if obj.fkey != varlib:
#             raise RuntimeError(ERRORMSG[7])
#         obj.delete()
#         return JsonResponse(0, safe=False)
#     except RuntimeError as e:
#         return JsonResponse({"error": str(e)}, safe=False)


def VARPL_Update(fkey, id, name, datatype):
    try:
        (fkey, id, name, datatype) = (IntCheck(fkey, 6),
                                      IntCheck(id, 1), StringCheck(name), str(datatype))

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
        return JsonResponse(serializers.VariablePoolSerializer(obj).data, safe=False, json_dumps_params={"ensure_ascii": False})
    except RuntimeError as e:
        return JsonResponse({"error": str(e)}, safe=False)

# score card


# def SCLB_Add(name):
#     try:
#         if not name:
#             raise RuntimeError(ERRORMSG[0])
#         lb = ScoreCardLibrary()
#         lb.name = name
#         lb.save()
#         return JsonResponse(0, safe=False)
#     except RuntimeError as e:
#         return JsonResponse({"error": str(e)}, safe=False)


# def SCLB_Del(id):
#     try:
#         id = sint(id)
#         if id is None:
#             raise RuntimeError(ERRORMSG[1])
#         obj = ScoreCardLibrary.objects.filter(pk=id).first()
#         if obj is None:
#             raise RuntimeError(ERRORMSG[2])
#         obj.delete()
#         return JsonResponse(0, safe=False)
#     except RuntimeError as e:
#         return JsonResponse({"error": str(e)}, safe=False)


# def SCLB_Update(id, name):
#     try:
#         id = sint(id)
#         if id is None:
#             raise RuntimeError(ERRORMSG[1])
#         if not name:
#             raise RuntimeError(ERRORMSG[0])
#         obj = ScoreCardLibrary.objects.filter(pk=id).first()
#         if obj is None:
#             raise RuntimeError(ERRORMSG[2])
#         obj.name = name
#         obj.save()
#         return JsonResponse(0, safe=False)
#     except RuntimeError as e:
#         return JsonResponse({"error": str(e)}, safe=False)

# scorecard pool


def SCPL_Add(fkey, rule, weight, score):
    try:
        (fkey, weight, score) = (IntCheck(fkey, 6),
                                 FloatCheck(weight, 8), FloatCheck(score, 9))
        lib = ScoreCardLibrary.objects.filter(pk=fkey).first()
        if lib is None:
            raise RuntimeError(
                ERRORMSG[3])
        pool = ScoreCardPool()
        pool.fkey = lib
        pool.rule = Rule(rule).PartialDump(
            ["variable", "datatype", "operator", "value"])
        pool.weight = weight
        pool.score = score
        pool.save()
        return JsonResponse(serializers.ScoreCardPoolSerializer(pool).data, safe=False, json_dumps_params={"ensure_ascii": False})

    except RuntimeError as e:
        return JsonResponse({"error": str(e)}, safe=False)


# def SCPL_Del(fkey, id):
#     try:
#         fkey = sint(fkey)
#         if fkey is None:
#             raise RuntimeError(ERRORMSG[6])
#         varlib = ScoreCardLibrary.objects.filter(pk=fkey).first()
#         if varlib is None:
#             raise RuntimeError(
#                 ERRORMSG[3])
#         id = sint(id)
#         if id is None:
#             raise RuntimeError(ERRORMSG[1])
#         obj = ScoreCardPool.objects.filter(pk=id).first()
#         if obj is None:
#             raise RuntimeError(ERRORMSG[2])
#         if obj.fkey != varlib:
#             raise RuntimeError(ERRORMSG[7])
#         obj.delete()
#         return JsonResponse(0, safe=False)
#     except RuntimeError as e:
#         return JsonResponse({"error": str(e)}, safe=False)


def SCPL_Update(fkey, id, rule, weight, score):
    try:
        (fkey, id, weight, score) = (IntCheck(fkey, 6),
                                     IntCheck(id, 1), FloatCheck(weight, 8), FloatCheck(score, 9))

        lib = ScoreCardLibrary.objects.filter(pk=fkey).first()
        if lib is None:
            raise RuntimeError(
                ERRORMSG[3])
        obj = ScoreCardPool.objects.filter(pk=id).first()
        if obj is None:
            raise RuntimeError(ERRORMSG[2])
        if obj.fkey != lib:
            raise RuntimeError(ERRORMSG[7])
        r = Rule(rule)
        obj.rule = r.PartialDump(["variable", "operator", "value"])
        obj.weight = weight
        obj.score = score
        obj.save()
        return JsonResponse(serializers.ScoreCardPoolSerializer(obj).data, safe=False,  json_dumps_params={"ensure_ascii": False})

    except RuntimeError as e:
        return JsonResponse({"error": str(e)}, safe=False)


def RSPL_Add(fkey, rule, action, naction):
    try:
        fkey = IntCheck(fkey, 6)

        lib = RuleSetLibrary.objects.filter(pk=fkey).first()
        if lib is None:
            raise RuntimeError(
                ERRORMSG[3])
        pool = RuleSetPool()
        pool.fkey = lib
        pool.rule = Rule(rule).PartialDump(
            ["variable", "datatype", "operator", "value"])
        pool.action = Action(action).PartialDump()
        pool.naction = Action(naction).PartialDump()
        pool.save()
        return JsonResponse(serializers.RuleSetPoolSerializer(pool).data, safe=False, json_dumps_params={"ensure_ascii": False})

    except RuntimeError as e:
        return JsonResponse({"error": str(e)}, safe=False)


def RSPL_Update(fkey, id, rule, action, naction):
    try:
        (fkey, id) = (IntCheck(fkey, 6), IntCheck(id, 1))

        lib = RuleSetLibrary.objects.filter(pk=fkey).first()
        if lib is None:
            raise RuntimeError(
                ERRORMSG[3])
        obj = RuleSetPool.objects.filter(pk=id).first()
        if obj is None:
            raise RuntimeError(ERRORMSG[2])
        if obj.fkey != lib:
            raise RuntimeError(ERRORMSG[7])
        obj.rule = Rule(rule).PartialDump(
            ["variable", "datatype", "operator", "value"])
        obj.action = Action(action).PartialDump()
        obj.naction = Action(naction).PartialDump()
        obj.save()
        print(obj.rule)
        print(obj.action)
        return JsonResponse(serializers.RuleSetPoolSerializer(obj).data, safe=False, json_dumps_params={"ensure_ascii": False})

    except RuntimeError as e:
        return JsonResponse({"error": str(e)}, safe=False)
