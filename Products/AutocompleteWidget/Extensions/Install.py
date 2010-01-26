from StringIO import StringIO
from Products.Archetypes.Extensions.utils \
     import install_subskin
from Products.AutocompleteWidget.config import *


def install(self):
    out = StringIO()
    install_subskin(self, out, GLOBALS)
    out.write("Successfully installed %s." % PROJECTNAME)
    return out.getvalue()