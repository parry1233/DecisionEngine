from pyexpat import model
from django.db import models
import system.static as static
import json
from types import SimpleNamespace


class URule:
    def __init__(self, var, opt, val):
        self.variable = var
        self.datatype = ""
        self.operator = opt
        self.value = val
        self.name = ""
        obj = VariablePool.objects.filter(pk=self.variable)
        if obj.exists:
            self.name = obj.first().name
            value_cast = {'b': lambda x: bool(x) == True,
                          'F': lambda x: float(x), 'I': lambda x: float(x)}
            self.datatype = obj.first().datatype
            self.value = value_cast[self.datatype](self.value)

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
            # if self.operator
            return f"{self.name} {static.OPERATOR_DICT[self.operator]} {str(rvalue)}"
        else:
            return "miss variable"


class Rule:
    def __init__(self, lst=None):
        self.rlist = []
        if(lst is not None):
            try:
                lst = json.loads(lst)
                for x in lst:
                    self.Add(URule(x["variable"], x["operator"],
                             x["value"]))
            except:
                raise RuntimeError("wrong rule format")

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

'''Try API with user data'''
class User(models.Model):
    id = models.AutoField(auto_created=True, primary_key=True)
    email = models.EmailField(unique=100)
    name = models.CharField(max_length=100)
    income = models.IntegerField()
