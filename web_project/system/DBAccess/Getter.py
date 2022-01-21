
from system.models import Rule, URule, ScoreCardLibrary, ScoreCardPool, VariableLibrary, VariablePool, DecisionTreeLibrary, DecisionTreePool
from system import static


def DATATYPE_Read():
    return static.CATAGORY


def VARLB_Read():
    lst = []
    for x in VariableLibrary.objects.all():
        lst.append((x.id, str(x)))
    return lst


def VARPL_Read(id):
    lst = []
    for x in VariablePool.objects.filter(fkey__id=id).all():
        lst.append((x.id, x.name, static.CATAGORY_DICT[x.datatype]))
    return lst
