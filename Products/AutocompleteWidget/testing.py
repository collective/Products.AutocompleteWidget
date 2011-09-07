# -*- coding: utf-8 -*-
from plone.testing import z2, zca
from plone.app.testing import PloneWithPackageLayer
from plone.app.testing import IntegrationTesting, FunctionalTesting
import Products.urban


AUTOCOMPLETE_ZCML = zca.ZCMLSandbox(filename="testing.zcml",
                             package=Products.urban,
                             name='AUTOCOMPLETE_ZCML')

AUTOCOMPLETE_Z2 = z2.IntegrationTesting(bases=(z2.STARTUP, AUTOCOMPLETE_ZCML),
                                 name='AUTOCOMPLETE_Z2')

AUTOCOMPLETE = PloneWithPackageLayer(
    zcml_filename="testing.zcml",
    zcml_package=Products.AutocompleteWidget,
    gs_profile_id='Products.AutocompleteWidget:default',
    name="AUTOCOMPLETE")

AUTOCOMPLETE_INTEGRATION = IntegrationTesting(
    bases=(AUTOCOMPLETE,), name="AUTOCOMPLETE_INTEGRATION")

AUTOCOMPLETE_FUNCTIONAL = FunctionalTesting(
    bases=(AUTOCOMPLETE,), name="AUTOCOMPLETE_FUNCTIONAL")
