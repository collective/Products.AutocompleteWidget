Overview
========

To use this package just create a field like::

    StringField('test_field',
            default='',
            searchable=0,
            required=0,
            vocabulary=DisplayList((('week', 'Week'), ('wedding','Wedding'),
                                ('winona','Winona'), ('winter', 'Winter'),
                                ('weather','Weather'), ('cow', 'Cow'))),
            widget=AutocompleteWidget(label='Test Widget',
                                description='Test this',
                                ),
            enforceVocabulary=0,
            ),

You can also use a LinesField instead of a StringField. The widget adapts automatically.
This has the advantage that you can index the field in the catalog (keyword index). Combine this with
the filter_bogus property on the widget and the widget will prepare the entered values.

It's useless without a vocabulary, and setting enforceVocabulary true doesn't
really make sense unless you use the LinesField.


Configuration
=============

There are a few parameters that can be set to
alter the behavior of the widget:

actb_timeout
  How long (ms) before the autocomplete box times
  out and dissapears.
  (Default: 2500, -1 to disable)

actb_lim
  How many choices to show in the autocomplete box at a time.
  (default: 5)

actb_firsttext
  Should the autocomplete serach be limited to the beginning of keyword (True),
  or should it search the entire entry for a match (False)?
  (default: 0)

actb_filter_bogus
  remove keywords that are not in the vocabulary and
  also remove redundant keywords, leading/trailing spaces etc.

actb_expand_onfocus
  expand the dropdown on focus.

actb_complete_on_tab
  set to 0 if you want tab to move the focus to the next widget.
  (default: 1)


Credits
=======

The javascript used is based on the widget at http://codeproject.com/jscript/jsactb.asp
by zichun and used with permission.


