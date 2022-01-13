import logging
import json
import clips


# env = clips.Environment()
# logging.basicConfig(level=10, format='%(message)s')
# router = clips.LoggingRouter()
# env.add_router(router)


# t_fact = """
# (deftemplate fact
#   (slot fulltime)
#   (slot over3yrs)
#   (slot over5yrs)
#   (slot previous_loan)
#   (slot repaid_on_time)
# )
# """
# env.build(t_fact)

# rulectr = -1


# def addrule(fulltime=0, over3yrs=0, over5yrs=0, previous_loan=0, repaid_on_time=0, output=""):
#     global rulectr, env
#     rulectr = rulectr + 1
#     r1 = f'''(defrule rule{rulectr}
#   (fact
#   (fulltime {fulltime})
#   (over3yrs {over3yrs})
#   (over5yrs {over5yrs})
#   (previous_loan {previous_loan})
#   (repaid_on_time {repaid_on_time})
#   )
#   =>
#   (println {output})
#   )
#   '''
#     env.build(r1)


# addrule(fulltime=1, over3yrs=1, output="Grant Loan")
# addrule(fulltime=1, over3yrs=0, previous_loan=1,
#         repaid_on_time=1, output="Grant Loan")
# addrule(fulltime=1, over3yrs=0, previous_loan=1,
#         repaid_on_time=0, output="No Loan")
# addrule(fulltime=1, over3yrs=0, previous_loan=0, output="No Loan")
# addrule(fulltime=0, over5yrs=1, previous_loan=1,
#         repaid_on_time=1, output="Grant Loan")
# addrule(fulltime=0, over5yrs=1, previous_loan=1,
#         repaid_on_time=0, output="No Loan")
# addrule(fulltime=0, over5yrs=1, previous_loan=0, output="No Loan")
# addrule(fulltime=0, over5yrs=0, output="No Loan")

# isFulltime = isOver3Yrs = isOver5Yrs = isPreviousLoan = isRepaidOnTime = 0
# if input("Are you a full time employee? y/n ") == "y":
#     isFulltime = 1
#     if input("Have they been with the bank over 3 years? y/n ") == "y":
#         isOver3Yrs = 1
#     else:
#         if input("Have they had a previous loan? y/n ") == "y":
#             isPreviousLoan = 1
#             if input("And was that load repaid on time? y/n ") == "y":
#                 isRepaidOnTime = 1
# else:
#     if input("Have they been with the bank over 5 years? y/n ") == "y":
#         isOver5Yrs = 1
#         if input("Have they had a previous loan? y/n ") == "y":
#             isPreviousLoan = 1
#             if input("And was that load repaid on time?? y/n ") == "y":
#                 isRepaidOnTime = 1

# template = env.find_template('fact')
# template.assert_fact(fulltime=isFulltime,
#                      over3yrs=isOver3Yrs,
#                      over5yrs=isOver5Yrs,
#                      previous_loan=isPreviousLoan,
#                      repaid_on_time=isRepaidOnTime
#                      )

# iteration = env.run()
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


env.define_function(is_bigger)
env.define_function(is_smaller)
env.define_function(is_equal)
rule_count = 0


def build_rule():
    global rule_count

    env.build()
    rule_count = rule_count + 1


env.build('''
(defrule Rule0
(declare (salience 2))
(urule (name "a")(value ?value))
(test (is_bigger ?value 0))
=>
(undefrule Rule1)
(if ( do-for-fact((?r urule)) (= (str-compare ?r:name "b") 0) (modify ?r (value 2) ) )
then else
( assert (urule (name "b")(value 1)) )
)
(println hi)
)
''')
env.build('''
(defrule Rule1
(declare (salience 1))
(urule (name "b")(value ?value))
(test (is_bigger ?value 0))
=>
( assert (urule (name "a")(value 1)) )
(println fireR2 ?value)
)
''')
template = env.find_template('urule')
template.assert_fact(name="a", value=20)
# template.assert_fact(name="b", value=20)
iteration = env.run()
# for fact in env.facts():
#     print(fact)
