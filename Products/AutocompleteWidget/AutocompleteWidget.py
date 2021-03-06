from AccessControl import ClassSecurityInfo
from Products.Archetypes.public import StringWidget
from Products.CMFPlone.utils import safe_unicode
from Products.CMFCore.utils import getToolByName
from logging import getLogger

logger = getLogger('AutocompleteWidget')

class AutocompleteWidget(StringWidget):
    security = ClassSecurityInfo()

    _properties = StringWidget._properties.copy()
    _properties.update({
        'macro' : "autocomplete",
        'helper_js': ('actb_widget.js',),
        'helper_css': ('actb_widget.css',),
        'actb_timeout': 2250, #How long (ms) before the autocomplete times out
        'actb_lim': 5, #How many choices to show at a time
        'actb_firsttext': 0, #Should the auto complete be limited to the
                             #beginning of keyword?
        'actb_filter_bogus': 1, # 1: removes items not in the vocabulary
        'actb_expand_onfocus': 1, # expands the dropdown on field focus
        'actb_multi_select':1, # determines if the widget allows just one keyboard or only one.
        'actb_complete_on_tab': 1, # when set to 0, pressing tab moves the focus to the next widget
        'actb_show_clear_button': 1,
        'encoding' : None, # used for vocabulary value encoding for vocabulary keys comparison, otherwise the getTerm method won't correctly get the associated key
        'actb_multivalued_adding_is_required': True, # if true, input content of a multivalued widget won't be considered if 'add' button hasn't been clicked
        })

    security.declarePrivate('keyword_from_value')
    def keyword_from_value(self, value, instance, field):
        logger.debug("AutocompleteWidget.keyword_from_value is deprecated")
        vocab = field.Vocabulary(instance) # potentially expensive
        if self.actb_filter_bogus:
            # delete bogus keywords
            return vocab.getKey(value.strip(), None)
        else:
            # keep bogus keywords ; if no keyword, use value
            return vocab.getKey(value.strip(), value.strip())

    security.declarePublic('process_form')
    def process_form(self, instance, field, form, empty_marker=None, emptyReturnsMarker=False):
        """ process the string into a list """

        value = form.get(field.getName(), '')
        value = safe_unicode(value) or ''
        input_toadd_value = form.get(field.getName() + '_toadd', None)

        # no value!
        if field.type=='lines' or field.multiValued:
            if value:
                pass
            elif (not self.actb_multivalued_adding_is_required) \
                    and input_toadd_value:
                # user filled to_add field
                pass
            else:
                return [], {}
        elif not value:
            return '', {}

        vocab = field.Vocabulary(instance)

        def kw_from_value(val):
            val = val.strip()
            if self.encoding:
                val = val.encode(self.encoding)

            if self.actb_filter_bogus:
                # delete bogus keywords
                return vocab.getKey(val.strip(), None)
            else:
                # keep bogus keywords if no keyword, use value
                return vocab.getKey(val.strip(), val.strip())

        ptool = getToolByName(instance, 'portal_properties')
        additional_separators = ptool.site_properties.atcb_additional_separators
        if field.multiValued or field.type=='lines':
            # make delimiters uniform
            for additionnal_separator in additional_separators:
                value = value.replace(additionnal_separator, ';')

            # get keywords from values
            values = value.split(';')
            result = []

            for value in values:
                keyword = kw_from_value(value)
                if keyword and keyword not in result:
                    result.append(keyword)

            if not self.actb_multivalued_adding_is_required:
                keyword = kw_from_value(input_toadd_value)
                if keyword and keyword not in result:
                    result.append(keyword)

            if field.type != 'lines' and field.type != 'reference':
                result= ';'.join(result)
        else:
            keyword = kw_from_value(value)
            result = keyword and keyword or ''

        return result, {}

from Products.Archetypes.Registry import registerWidget

registerWidget(AutocompleteWidget,
               title='Autocomplete',
               description="Text field with vocabulary based autocomplete.",
               used_for=('Products.Archetypes.public.StringField',)
               )
