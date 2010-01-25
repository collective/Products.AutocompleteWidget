from AccessControl import ClassSecurityInfo
from Products.Archetypes.public import StringWidget

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
        'actb_filter_bogus': 0, # 1: removes items not in the vocabulary
        'actb_expand_onfocus': 1, # expands the dropdown on field focus
        'actb_multi_select':1 # determines if the widget allows just one keyboard or only one.
        })
    
    security.declarePublic('process_form')
    def process_form(self, instance, field, form, empty_marker=None, emptyReturnsMarker=False):
        """ process the string into a list """

        # first preprocess if necessary
        value = form.get(field.getName(), empty_marker)
        if type(value)==list:
            value=';'.join(value)
            
        vocab = field.Vocabulary(instance)
        
        
        if self.actb_filter_bogus==1:
            
            # make delimiters uniform
            value = value.replace(',', ';')
            
            keywords = value.split(';');
            keywords = [k.strip() for k in keywords]
            result = []
            
            # now check if the keywords are in the vocab
            for keyword in keywords:
                if keyword in vocab and keyword not in result:
                    result.append(keyword)
            
            if field.type!='lines':
                # make it a string again
                result= ';'.join(result)
        else:
            # don't filter out non-vocab keywords
            if field.type=='lines':
                # make delimiters uniform
                value = value.replace(',', ';')
                
                keywords = value.split(';');
                keywords = [k.strip() for k in keywords]
                result = []
                # simply remove redunant keywords
                for keyword in keywords:
                    if keyword not in result:
                        result.append(keyword)
                    
            else: 
                result = value
            
        return result,{}

from Products.Archetypes.Registry import registerWidget

registerWidget(AutocompleteWidget,
               title='Autocomplete',
               description="Text field with vocabulary based autocomplete.",
               used_for=('Products.Archetypes.public.StringField',)
               )