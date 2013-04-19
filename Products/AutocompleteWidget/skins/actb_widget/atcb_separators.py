## Script (Python) "canTrash"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=
##title=
separators = context.portal_properties.site_properties.atcb_additional_separators
separators = [';'] + list(separators)
return str(separators)[1:-1]