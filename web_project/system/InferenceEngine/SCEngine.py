
import clips
import logging
from types import SimpleNamespace


class SCE:
    # Scoreboard Engine
    def __init__(self):
        self.setrule = False
        self.total = 0
        self.varmap = dict()
        self.typemap = dict()
        self.rule_ctr = 0
        self.salience = 9999
        self.satisfy = []
        self.env = clips.Environment()

        logging.basicConfig(level=10, format='%(message)s')
        router = clips.LoggingRouter()
        self.env.add_router(router)

        def addscore(score):
            self.total = self.total + score

        def is_satisfy(i):
            self.satisfy[i] = True
        self.env.define_function(addscore)
        self.env.define_function(is_satisfy)

        self.env.build('''
        (deftemplate urule
        (slot name)
        (slot value))
        ''')

    def assign(self, name_value_map):
        if not self.setrule:
            raise NameError('rule must be set before assign variable')
        if name_value_map is not None:
            for x, y in name_value_map.items():
                template = self.env.find_template('urule')
                template.assert_fact(name=x, value=y)
                self.varmap |= {x: y}

    def defrule(self, rules):
        self.setrule = True
        for rule, score in rules:
            rstr = f'''
            (defrule Rule{self.rule_ctr}
            (declare (salience {self.salience}))'''
            for x in rule.GetRaw():
                rstr += f'''
                (urule (name "{x.ID()}")(value ?{x.ID()}))
                '''
                self.varmap |= {x.ID(): None}
                self.typemap |= {x.ID(): x.datatype}

            rstr += f'''
            (test {rule.Prefix()})
            =>
            (addscore {score})
            (is_satisfy {self.rule_ctr})
            )
            '''
            self.env.build(rstr)
            self.rule_ctr = self.rule_ctr + 1
            self.salience = self.salience - 1
            self.satisfy.append(False)

    def info(self):
        return SimpleNamespace(varmap=self.varmap)

    def run(self) -> float:
        unassign_map = dict()
        value_cast = {'b': lambda: False,
                      'F': lambda: 0.0, 'I': lambda: 0}
        for x, y in self.varmap.items():
            if y is None:
                unassign_map |= {x: value_cast[self.typemap[x]]()}

        self.assign(unassign_map)
        self.env.run()
        return self.total, self.satisfy
