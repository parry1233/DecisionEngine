
import clips
import logging
from types import SimpleNamespace


class RSE:
    # Rule Set Engine
    def __init__(self, circular: bool):
        self.setrule = False
        self.varmap = dict()
        self.typemap = dict()
        self.rule_ctr = 0
        self.salience = 9999
        self.env = clips.Environment()
        self.circular = circular
        self.log = []

        logging.basicConfig(level=10, format='%(message)s')
        router = clips.LoggingRouter()
        self.env.add_router(router)

        def record(l):
            self.log.append(l)

        self.env.define_function(record)
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

        def addrule(rule, action, naction):
            if not rule or not (action or naction):
                return

            actiondeclare = ''.join(x.Prefix()
                                    for x in action.GetRaw()) if action else ""
            nactiondeclare = ''.join(x.Prefix()
                                     for x in naction.GetRaw()) if naction else ""
            vardeclare = ['''(urule (name "{id}")(value ?{id}))'''.format(
                id=x.ID()) for x in rule.GetRaw()]
            rulename = f"Rule{self.rule_ctr}"
            if self.circular:
                rstr = f'''
                (
                    defrule {rulename}
                    (declare (salience {self.salience}))
                    {''.join(vardeclare)}
                    =>
                    (
                        if {rule.Prefix()}
                        then
                        {actiondeclare}
                        else
                        {nactiondeclare}
                    )
                )
                '''
            else:
                self.env.build(
                    "(defglobal ?*Rule{0}* = TRUE)".format(self.rule_ctr))
                rstr = f'''
                (
                    defrule {rulename}
                    (declare (salience {self.salience}))
                    {''.join(vardeclare)}
                    (test (eq ?*{rulename}* TRUE))
                    =>
                    (bind ?*{rulename}* FALSE)
                    (
                        if {rule.Prefix()}
                        then
                        {actiondeclare}
                        else
                        {nactiondeclare}
                    )
                )
                '''
            for x in rule.GetRaw():
                self.varmap |= {x.ID(): None}
                self.typemap |= {x.ID(): x.datatype}

            self.env.build(rstr)

            self.salience -= 1
            self.rule_ctr += 1

        for rule, action, naction in rules:
            addrule(rule, action if action.exists() else None,
                    naction if naction.exists() else None)

        # for x in self.env.rules():
        #     print(x)

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
        self.assign({x["name"]: x["value"] if x["value"] not in ["TRUE", "FALSE"]
                     else x["value"] == "TRUE" for x in self.env.facts()})
        return self.log
