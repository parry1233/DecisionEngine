
from django.db import models
import system.static as static
import json
from types import SimpleNamespace
from enum import IntEnum
from . import utility


class UAction:
    def __init__(self, method: static.METHOD, data: dict):
        if method == static.METHOD.PRINT:
            try:
                log = data["log"]
            except:
                raise RuntimeError(static.ERRORMSG[12])
            self.method = method
            self.content = {"log": log}
        elif method == static.METHOD.ASSIGN:
            try:
                target = data["id"]
                value = data["value"]
            except:
                raise RuntimeError(static.ERRORMSG[12])

            obj = VariablePool.objects.filter(
                pk=target).first()
            if obj is None:
                raise RuntimeError(static.ERRORMSG[2])
            value_check = {'b': lambda x: type(x) == bool,
                           'F': lambda x: utility.sfloat(x) is not None, 'I': lambda x: type(x) == int}
            value_cast = {'b': lambda x: bool(x),
                          'F': lambda x: float(x), 'I': lambda x: int(x)}
            try:
                if not value_check[obj.datatype](value):
                    raise RuntimeError(
                        f"cannot assign {value} to obj({target}, {static.CATAGORY_DICT[obj.datatype]})")
                value = value_cast[obj.datatype](value)
            except:
                raise RuntimeError(
                    f"cannot assign {value} to obj({target}, {static.CATAGORY_DICT[obj.datatype]})")
            self.method = method
            self.content = {"id": target, "value": value}
        else:
            raise RuntimeError(static.ERRORMSG[13])

    def IsPrint(self):
        return self.method == static.METHOD.PRINT

    def PRINT_data(self):
        if self.IsPrint():
            return self.content["log"]
        return None

    def IsAssign(self):
        return self.method == static.METHOD.ASSIGN

    def ASSIGN_data(self):
        if self.IsAssign():
            return (self.content["id"], self.content["value"])
        return None

    def Prefix(self):
        if self.IsPrint():
            return f'''(record "{self.PRINT_data()}")'''
        elif self.IsAssign():
            def ID():
                return f'''r{self.content["id"]}'''

            def Val():
                return self.content["value"]
            return f'''
            (
                if ( do-for-fact((?r urule)) (eq ?r:name "{ID()}") (modify ?r (value {Val()}) ) )
                then else
                ( assert (urule (name "{ID()}")(value {Val()})) )
            )
            '''


class Action:
    def __init__(self, lst=None):
        self.rlist = []
        if lst:
            try:
                lst = json.loads(lst)
                if lst:
                    for x in lst:
                        self.rlist.append(UAction(x["method"], x["content"]))
            except json.decoder.JSONDecodeError as e:
                raise RuntimeError("wrong action format {}".format(str(e)))
            except RuntimeError as e:
                raise RuntimeError(str(e))

    def Get(self):
        return json.dumps(self.rlist, separators=(',', ':'), default=vars)

    def GetRaw(self):
        return self.rlist

    def exists(self):
        return len(self.rlist) != 0

    def Partial(self, lst=None):
        if lst is not None:
            return [{key: vars(r)[key] for key in lst} for r in self.rlist]
        else:
            if self.exists():
                return [vars(r) for r in self.rlist]
            else:
                return None

    def PartialDump(self, lst=None):
        return json.dumps(self.Partial(lst), separators=(',', ':'), default=vars)


class URule:
    def __init__(self, var, opt, val):
        self.variable = var
        self.datatype = ""
        self.operator = opt
        if self.operator not in static.OPERATOR_DICT:
            raise RuntimeError(static.ERRORMSG[10])
        self.value = val
        self.name = ""
        obj = VariablePool.objects.filter(pk=self.variable).first()
        if obj is not None:
            self.name = obj.name
            value_cast = {'b': lambda x: bool(x) == True,
                          'F': lambda x: float(x), 'I': lambda x: float(x)}
            self.datatype = obj.datatype
            try:
                self.value = value_cast[self.datatype](self.value)
            except:
                raise RuntimeError(static.ERRORMSG[11])
        else:
            raise RuntimeError(static.ERRORMSG[2])

    def ID(self):
        return f"r{self.variable}"

    def ToReadable(self):
        return SimpleNamespace(name=self.name, rule=f"{static.OPERATOR_DICT[self.operator]} {str(self.value)}")

    def Prefix(self):
        obj = VariablePool.objects.filter(pk=self.variable)
        if obj.exists:
            value_cast = {'b': lambda x: "TRUE" if str(x).lower() not in ("0", "false") else "FALSE",
                          'F': lambda x: float(x), 'I': lambda x: float(x)}
            rvalue = value_cast[self.datatype](self.value)
            OPERATOR_CAST = {
                'b': '>',
                'e': 'eq',
                's': '<',
                'a': '>=',
                'p': '<=',
            }
            return f"({OPERATOR_CAST[self.operator]} ?{self.ID()} {str(rvalue)})"
        else:
            return "miss variable"

    def __str__(self):
        obj = VariablePool.objects.filter(pk=self.variable)
        if obj.exists:
            value_cast = {'b': lambda x: str(x).lower() in ("true", "1"),
                          'F': lambda x: float(x), 'I': lambda x: float(x)}
            rvalue = value_cast[self.datatype](self.value)
            opera = ""
            if self.operator not in static.OPERATOR_DICT:
                opera = "?"
            else:
                opera = static.OPERATOR_DICT[self.operator]
            return f"{self.name} {opera} {str(rvalue)}"
        else:
            return "miss variable"


class Rule:
    def __init__(self, lst=None):
        self.rlist = []
        if lst is not None:
            try:
                lst = json.loads(lst)
                for x in lst:
                    self.Add(URule(x["variable"], x["operator"],
                                   x["value"]))
            except json.decoder.JSONDecodeError:
                raise RuntimeError("wrong rule format")
            except RuntimeError as e:
                raise RuntimeError(str(e))

    def Add(self, urule):
        self.rlist.append(urule)

    def Copy(self):
        u = Rule()
        u.rlist = u.rlist + self.rlist
        return u

    def Concatenate(self, ruleb):
        self.rlist = self.rlist + ruleb.GetRaw()

    def Load(self):
        if len(self.rlist) > 0:
            urule = self.rlist.pop(0)
            yield urule
            yield from self.Load()

    def Get(self):
        return json.dumps(self.rlist, separators=(',', ':'), default=vars)

    def GetRaw(self):
        return self.rlist

    def ToString(self):
        lst = [str(k) for k in self.rlist]
        return " and ".join(lst)

    def Prefix(self):
        if len(self.rlist) > 1:
            lst = [k.Prefix() for k in self.rlist]
            ce = " ".join(lst)
            return f"(and {ce})"
        else:
            return f"{self.rlist[0].Prefix()}"

    def Partial(self, lst):
        return [{key: vars(r)[key] for key in lst} for r in self.rlist]

    def PartialDump(self, lst):
        return json.dumps(self.Partial(lst), separators=(',', ':'), default=vars)


class VariableLibrary(models.Model):
    name = models.CharField(
        max_length=20, help_text='Enter name')

    def __str__(self):
        return self.name


class VariablePool(models.Model):
    name = models.CharField(
        max_length=40, help_text='Enter name')
    datatype = models.CharField(
        max_length=1,
        choices=static.CATAGORY,
        default='b',
        help_text='Data Type',
    )
    fkey = models.ForeignKey(
        'VariableLibrary', on_delete=models.CASCADE)

    def __str__(self):
        return self.name + "_" + str(self.id)


class ScoreCardLibrary(models.Model):
    name = models.CharField(
        max_length=20, help_text='Enter name')

    def __str__(self):
        return f"{self.name} ({str(self.id)})"


class ScoreCardPool(models.Model):
    fkey = models.ForeignKey(
        'ScoreCardLibrary', on_delete=models.CASCADE)
    rule = models.TextField(help_text='Rule', null=True)
    weight = models.FloatField(
        default='1',
        help_text='Weight',
    )
    score = models.FloatField(
        default='1',
        help_text='Score',
    )

    def __str__(self):
        words = [str(k) for k in Rule(self.rule).Load()]
        text = ""
        text += " , ".join(words)
        return self.fkey.name + " | " + text


class DecisionTreeLibrary(models.Model):
    name = models.CharField(
        max_length=20, help_text='Enter name')

    def __str__(self):
        return self.name


class DecisionTreePool(models.Model):
    fkey = models.ForeignKey(
        'DecisionTreeLibrary', on_delete=models.CASCADE)
    prev = models.ForeignKey(
        'DecisionTreePool', on_delete=models.CASCADE, null=True, blank=True)
    rule = models.TextField(help_text='Rule', null=True)
    log = models.TextField(help_text='Log', blank=True)

    def duplicate_event(modeladmin, request, queryset):
        for object in queryset:
            object.id = None
            object.save()

    duplicate_event.short_description = "Duplicate selected record"

    def __str__(self):
        words = [str(k) for k in Rule(self.rule).Load()]
        text = ""
        text += " , ".join(words)
        return f'''({self.id}) {self.fkey.name} | {text}'''


class RuleSetLibrary(models.Model):
    name = models.CharField(
        max_length=20, help_text='Enter name')

    def __str__(self):
        return f"{self.name} ({str(self.id)})"


class RuleSetPool(models.Model):
    fkey = models.ForeignKey(
        'RuleSetLibrary', on_delete=models.CASCADE)
    rule = models.TextField(help_text='Rule', null=True)
    action = models.TextField(help_text='Action', blank=True, null=True)
    naction = models.TextField(help_text='nAction', blank=True, null=True)

    def __str__(self):
        words = [str(k) for k in Rule(self.rule).Load()]
        text = ""
        text += " , ".join(words)
        return f"{self.fkey} | {text}"
