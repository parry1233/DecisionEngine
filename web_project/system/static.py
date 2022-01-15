
# model data type
CATAGORY = (
    ('b', 'Bool'),
    ('F', 'Float'),
    ('I', 'Integar'),
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
