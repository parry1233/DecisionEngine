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

ERRORMSG = ["the name must not be empty",
            "id must be an integer",
            "obj not exist",
            "could not find foreign key in library",
            "invalid datatype",
            "the name must not be empty",
            "foreign key must be an integer",
            "operated obj not corresponed to specified library",
            "weight must be float",
            "score must be float",
            "invalid operator",
            "value assigned conflicts with it's datatype",
            "incomplete parameters",
            "invalid action"]
