# Atlas Quest geography content

Bundled snapshot reviewed October 14, 2026. Not a runtime dependency on external APIs.

- Country metadata: https://github.com/restcountries/restcountries/blob/master/src/main/resources/countriesV3.1.json
- Country scope: 193 UN members plus Holy See/Vatican City and Palestine. Guinea-Bissau is explicitly included despite a mistaken `unMember` flag in the source snapshot. https://www.un.org/about-us/member-states
- Main geometry: world-atlas 2.0.2 countries-50m, Natural Earth public-domain boundaries: https://github.com/topojson/world-atlas
- Tuvalu (absent from the 50m dataset): Natural Earth 10m actual island boundaries, extracted without inventing a silhouette: https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_10m_admin_0_countries.geojson
- Map boundaries are simplified cartographic boundaries, not a statement on sovereignty. Territories are shown as context but not included in the 195-country question pool. Some countries span continents; selection deduplicates their codes.

## Capital grading policy

At the parent's request, questions ask simply for a capital and accept any configured current capital or recognized national-government center. Brief feedback lists the alternatives instead of requiring children to distinguish government branches. These broad accepted answers are educational grading allowances, not assertions that every city is constitutionally a capital. Former capitals are not automatically accepted.

Reviewed alternatives include South Africa (Pretoria, Cape Town, Bloemfontein), Bolivia (Sucre, La Paz), Sri Lanka (Sri Jayawardenepura Kotte, Colombo), Eswatini (Mbabane, Lobamba), Netherlands (Amsterdam, The Hague), Malaysia (Kuala Lumpur, Putrajaya), Benin (Porto-Novo, Cotonou), Ivory Coast (Yamoussoukro, Abidjan), Tanzania (Dodoma, Dar es Salaam), Burundi (Gitega, Bujumbura), Chile (Santiago, Valparaiso), Montenegro (Podgorica, Cetinje), and Palestine (East Jerusalem, Ramallah). Nauru has no official capital; Yaren is explicitly described as its government center. Palestine's claimed capital and current government center are explained in feedback. Capital spellings and aliases are bundled in atlas-data.js.

Primary references used for the special cases and recent changes:

- https://www.gov.za/south-africa-glance
- https://www.government.nl/binaries/government/documenten/publications/2017/04/21/culture-at-a-first-glance/CIB2015_ENG_publicatie_v8_DEF.pdf
- https://www.kotte.mc.gov.lk/index.php?Itemid=175&id=25&lang=en&option=com_content&view=article
- https://www.pmo.gov.my/en/perdana-putra/
- https://sgg.gouv.bj/doc/decret-2016-064/download
- https://au.int/en/cities/lobambaroyal-and-legislative-mbabane-administrative
- https://www.gov.kz/article/19305?lang=en (Astana)
- https://www.guineaecuatorialpress.com/index.php/noticias/el_presidente_de_la_republica_proclama_la_ciudad_de_la_paz_como_capital_de_la_republica_de_guinea_ecuatorial_con_la_firma_de_un_decreto_ley (Ciudad de la Paz, January 2026)

Honduras also accepts Tegucigalpa and Comayagüela (the paired capital district), and Yemen accepts Sana'a/Sanaa and Aden (provisional capital). Ordinary accent-free spellings of national capitals are accepted; this does not loosen Accent Lab or Spanish spelling grading.

Additional references: https://odh.sedh.gob.hn/category/view/293/distrito-central and https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/566776/CIG_-_Yemen_-_Security_and_Humanitarian_Situation.pdf

Source license notices are retained in vendor/restcountries-LICENSE.txt and vendor/world-atlas-LICENSE.txt. Natural Earth geometry is public domain.

For future corrections, edit the bundled content and publish a new cache version. New questions do not silently change with an external feed.
