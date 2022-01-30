from distutils.log import error
from system.models import Rule, URule, ScoreCardLibrary, ScoreCardPool, VariableLibrary, VariablePool, DecisionTreeLibrary, DecisionTreePool
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
#         return JsonResponse({"error": repr(e)}, safe=False)


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
#         return JsonResponse({"error": repr(e)}, safe=False)


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
#         return JsonResponse({"error": repr(e)}, safe=False)

# variable pool


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
                    return JsonResponse(serializers.VariablePoolSerializer(variablepool).data, safe=False , json_dumps_params={"ensure_ascii": False})
                else:
                    raise RuntimeError(ERRORMSG[4])
            else:
                raise RuntimeError(ERRORMSG[0])
        else:
            raise RuntimeError(ERRORMSG[6])
    except RuntimeError as e:
        return JsonResponse({"error": repr(e)}, safe=False)


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
#         return JsonResponse({"error": repr(e)}, safe=False)


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
        return JsonResponse(serializers.VariablePoolSerializer(obj).data, safe=False, json_dumps_params={"ensure_ascii": False})
    except RuntimeError as e:
        return JsonResponse({"error": repr(e)}, safe=False)

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
#         return JsonResponse({"error": repr(e)}, safe=False)


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
#         return JsonResponse({"error": repr(e)}, safe=False)


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
#         return JsonResponse({"error": repr(e)}, safe=False)

# scorecard pool


def SCPL_Add(fkey, rule, weight, score):
    (fkey, weight, score) = (sint(fkey), sfloat(weight), sfloat(score))
    try:
        if fkey is None:
            raise RuntimeError(ERRORMSG[6])
        if weight is None:
            raise RuntimeError(ERRORMSG[8])
        if score is None:
            raise RuntimeError(ERRORMSG[9])

        lib = ScoreCardLibrary.objects.filter(pk=fkey).first()
        if lib is None:
            raise RuntimeError(
                ERRORMSG[3])
        r = Rule(rule)
        pool = ScoreCardPool()
        pool.fkey = lib
        pool.rule = r.PartialDump(
            ["variable", "datatype", "operator", "value"])
        pool.weight = weight
        pool.score = score
        pool.save()
        return JsonResponse(serializers.ScoreCardPoolSerializer(pool).data, safe=False, json_dumps_params={"ensure_ascii": False})

    except RuntimeError as e:
        return JsonResponse({"error": repr(e)}, safe=False)


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
#         return JsonResponse({"error": repr(e)}, safe=False)


def SCPL_Update(fkey, id, rule, weight, score):
    (fkey, id, weight, score) = (sint(fkey),
                                 sint(id), sfloat(weight), sfloat(score))
    try:
        if fkey is None:
            raise RuntimeError(ERRORMSG[6])
        if id is None:
            raise RuntimeError(ERRORMSG[1])
        if weight is None:
            raise RuntimeError(ERRORMSG[8])
        if score is None:
            raise RuntimeError(ERRORMSG[9])

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
        return JsonResponse({"error": repr(e)}, safe=False)
