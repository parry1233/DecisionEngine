
from system.models import Rule, URule, ScoreCardLibrary, ScoreCardPool, VariableLibrary, VariablePool, DecisionTreeLibrary, DecisionTreePool
from system import static


def DATATYPE_Read():
    return static.CATAGORY_DICT


def VARPL_Read(id):
    return [{"id": x.id, "name": x.name,
             "datatype": static.CATAGORY_DICT[x.datatype]}
            for x in VariablePool.objects.filter(fkey__id=id).all()]


def SCLB_Read():
    lst = []
    for x in ScoreCardLibrary.objects.all():
        lst.append({"id": x.id, "name": x.name})
    return lst


def SCPL_Read(id):

    lst = []
    for x in ScoreCardPool.objects.filter(fkey__id=id).all():
        lst.append({"id": x.id, "rule": Rule(x.rule).ToString(),
                   "weight": x.weight, "score": x.score})
    return lst
