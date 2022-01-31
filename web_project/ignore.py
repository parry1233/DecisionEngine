import logging
import json
import clips
from web_project.wsgi import *
import system.models as models
from system.models import Action, UAction
from system import static

# a = UAction(static.Method.PRINT, {"log": 111})
# b = UAction(static.Method.ASSIGN, {"id": 1, "value": 1})
# s= json.dumps([a,b], separators=(',', ':'), default=vars)
# t = Action(s)
# print(t.Partial())

env = clips.Environment()
logging.basicConfig(level=10, format='%(message)s')
router = clips.LoggingRouter()
env.add_router(router)

env.build('''
(deftemplate urule
 (slot name)
 (slot value))
 ''')


def is_bigger(a, b):
    return a > b


def is_smaller(a, b):
    return a < b


def is_equal(a, b):
    return a == b


def record(l):
    print(str(l))


env.define_function(is_bigger)
env.define_function(is_smaller)
env.define_function(is_equal)
env.define_function(record)


# env.build('''
# (defrule remove-identital
# (declare (salience 100))
# ?f1 <- (urule (name ?a)(value ?va))
# ?f2 <- (urule (name ?b)(value ?vb))
# (test (and (eq ?a ?b) (neq ?va ?vb)))
# =>
# (println ?a " " ?va " " ?b " " ?vb)
# (retract ?f2)
# )
# ''')
total = 0


def add(s):
    global total
    total = total + s


env.define_function(add)
# env.build('''
# (defrule Rule5
# (declare (salience 9994))
#     (urule (name "r1")(value ?r1))

# (test (and (eq ?r1 "True") True))
# =>
# (println 1)
# )''')
# env.build('''
# (defrule Rule0
# (declare (salience 2))
# (urule (name "a")(value ?value))
# (test (eq ?value 0))
# =>
# (if ( do-for-fact((?r urule)) (eq ?r:name "b") (modify ?r (value 2) ) )
# then else
# ( assert (urule (name "b")(value 1)) )
# )
# (println 1)
# )
# ''')
# env.build('''
# (defrule _
# =>
# (undefrule Rule0)
# )
# ''')
env.build("(defglobal ?*Rule0* = TRUE)")
env.build('''
            (
                defrule Rule0
                (declare (salience 9999))
                (urule (name "r3")(value ?r3))
                (test (eq ?*Rule0* TRUE))
                =>
                (bind ?*Rule0* FALSE)
                (println 3)
                (
                    if (eq ?r3 1.0)
                    then
                    (
                        if ( do-for-fact((?r urule)) (eq ?r:name "r3") (modify ?r (value 2) ) )
                        then else
                        ( assert (urule (name "r3")(value 2)) )
                    )
                    (println "1")
                    else
                    (println "2")
                )
            )
''')
# env.build('''
#             (defrule Rule0
#             (declare (salience 9998))
#                 (urule (name "r3")(value ?r3))

#                 (test (not(eq ?r3 1.0)))
#                 =>
#             (println ?r3)
#             )
# ''')
template = env.find_template('urule')
template.assert_fact(name="r3", value=1.2)

# template.assert_fact(name="b", value="True")
# template.assert_fact(name="r3", value=65)
# template.assert_fact(name="r4", value=True)

# template.assert_fact(name="a", value=20)
# template.assert_fact(name="a", value=True)
# template.assert_fact(name="b", value=20)
# template.assert_fact(name="b", value=False)
# template.assert_fact(name="b", value=20)
# a = set([1, 2, 3])
# a.difference(set(1))
# print(a)
iteration = env.run()
# for x in env.facts():
#     print(x)
# for x in env.rules():
#     print(x)
a=2
a=1
print(not a)