
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
ERRORMSG = ["the name must not be empty",
            "id must be an integer", 
            "obj not exist",
            "could not find foreign key in library",
            "invalid datatype",
            "the name must not be empty",
            "foreign key must be an integer",
            "operated obj not corresponed to specified library", ]
