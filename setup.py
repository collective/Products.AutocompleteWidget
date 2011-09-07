from setuptools import setup, find_packages

version = '1.2.2-dev'

setup(name='Products.AutocompleteWidget',
      version=version,
      description="Archetypes autocomplete widget with support "
          "for String-, Lines- and ReferenceFields",
      long_description=open("README.txt").read() + "\n" +
                       open("CHANGES.txt").read(),
      classifiers=[
        "Framework :: Zope2",
        "License :: OSI Approved :: Zope Public License",
        "Programming Language :: Python",
      ],
      keywords='Zope Plone Archetypes',
      author="Jonathan Riboux, Alec Mitchell and contributors",
      author_email="plone-developers@lists.sourceforge.net",
      url='http://plone.org/products/autocompletewidget/',
      license='see LICENSE.txt',
      packages=find_packages(exclude=['ez_setup']),
      namespace_packages=['Products'],
      include_package_data=True,
      zip_safe=False,
      extras_require=dict(
            test=['unittest2', 'zope.testing', 'plone.testing',
                  'plone.app.testing']),
      install_requires=[
        'setuptools',
        'Plone',
        'collective.js.jqueryui',
        # 'Zope2',
      ],
)
