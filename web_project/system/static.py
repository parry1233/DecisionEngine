from enum import IntEnum

# model data type
CATAGORY = (
    ('b', 'Bool'),
    ('F', 'Float'),
    ('I', 'Integer'),
)
CATAGORY_DICT = dict((v, k) for v, k in CATAGORY)

# compare operator
OPERATOR = (
    ('b', '>'),
    ('e', '='),
    ('s', '<'),
    ('a', '>='),
    ('p', '<='),
)
OPERATOR_DICT = dict((v, k) for v, k in OPERATOR)
OPERATOR_RDICT = dict((v, k) for k, v in OPERATOR)


class METHOD(IntEnum):
    PRINT = 1
    ASSIGN = 2


METHOD_DCIT = {i.name: i.value for i in METHOD}
METHOD_RDCIT = {i.value: i.name for i in METHOD}

ERRORMSG = {
    0: "the name must not be empty",
    1: "id must be an integer",
    2: "obj not exist",
    3: "could not find foreign key in library",
    4: "invalid datatype",
    5: "the name must not be empty",
    6: "foreign key must be an integer",
    7: "operated obj not corresponed to specified library",
    8: "weight must be float",
    9: "score must be float",
    10: "invalid operator",
    11: "value assigned conflicts with it's datatype",
    12: "incomplete parameters",
    13: "invalid action"
}
