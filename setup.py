from setuptools import setup, find_packages

version = '1.3'

setup(name='Products.AutocompleteWidget',
      version=version,
      description="Archetypes autocomplete widget with support for String-, Lines- and ReferenceFields",
      long_description=open("README.txt").read() + "\n" +
                       open("CHANGES.txt").read(),
      classifiers=[
        "Framework :: Zope2",
        "License :: OSI Approved :: Zope Public License",
        "Programming Language :: Python",
      ],
      keywords='Zope Plone Archetypes',
      author="Jonathan Riboux, Alec Mitchell and contributors",
      author_email="jonathan.riboux@quadra-informatique.fr, plone-developers@lists.sourceforge.net",
      url='http://plone.org/products/autocompletewidget/',
      license='see LICENSE.txt',
      packages=find_packages(exclude=['ez_setup']),
      namespace_packages=['Products'],
      include_package_data=True,
      zip_safe=False,
      install_requires=[
        'setuptools',
        # 'Zope2',
      ],
)
