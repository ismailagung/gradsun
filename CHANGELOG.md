# Changelog

## [0.5.0](https://github.com/ismailagung/gradsun/compare/gradsun-v0.4.0...gradsun-v0.5.0) (2026-11-27)


### Features

* **admin-bookings:** implement admin reservation review, manual payment verification, and schedule locking use-cases ([#52](https://github.com/ismailagung/gradsun/issues/52)) ([c1d3bce](https://github.com/ismailagung/gradsun/commit/c1d3bce18e2f65085e9253291d0a8054aff81297))
* **admin:** implement login page with login-04 and modern admin sidebar with sidebar-07 ([#75](https://github.com/ismailagung/gradsun/issues/75)) ([#78](https://github.com/ismailagung/gradsun/issues/78)) ([4e31a9e](https://github.com/ismailagung/gradsun/commit/4e31a9e1121a4172937dd29a9154008315a2ede4))
* **admin:** organize sidebar into operations and content management with live preview CMS ([#95](https://github.com/ismailagung/gradsun/issues/95)) ([#96](https://github.com/ismailagung/gradsun/issues/96)) ([c797527](https://github.com/ismailagung/gradsun/commit/c79752704decdfbd9187c44e3b33b2354d94b580))
* **admin:** overhaul admin dashboard metrics, action highlight, and shoot schedules ([#93](https://github.com/ismailagung/gradsun/issues/93)) ([#94](https://github.com/ismailagung/gradsun/issues/94)) ([e851389](https://github.com/ismailagung/gradsun/commit/e851389c090f54f0e916262ee28b3f97588c1b9e))
* **auth:** enable development bypass for admin portal UI auditing ([#88](https://github.com/ismailagung/gradsun/issues/88)) ([1f842c4](https://github.com/ismailagung/gradsun/commit/1f842c4c57671d5886b172a32fe7ea7724dd067c))
* **auth:** integrate better-auth with role-based access control (rbac) for studio staff and admin portal protection ([#58](https://github.com/ismailagung/gradsun/issues/58)) ([017741a](https://github.com/ismailagung/gradsun/commit/017741a072d56fff2aa3f52a25cd0ba3a37d054a))
* **auth:** refine login brand identity, blurred emblem, and lightbulb toggle ([#91](https://github.com/ismailagung/gradsun/issues/91)) ([#92](https://github.com/ismailagung/gradsun/issues/92)) ([73c77fa](https://github.com/ismailagung/gradsun/commit/73c77fab5686c4959c714ef581f768f2bf8d4d1e))
* **bookings:** consolidate booking row actions into dropdown with detailed info dialog, approval, rejection, and whatsapp ([#99](https://github.com/ismailagung/gradsun/issues/99)) ([#100](https://github.com/ismailagung/gradsun/issues/100)) ([0381c49](https://github.com/ismailagung/gradsun/commit/0381c498073df250a607906e5290bf051b163733))
* **branding:** display raw brand logo without circular container ([#85](https://github.com/ismailagung/gradsun/issues/85)) ([#86](https://github.com/ismailagung/gradsun/issues/86)) ([176c736](https://github.com/ismailagung/gradsun/commit/176c73673207b944e99ec9aeb694637d8364bf05))
* **branding:** enlarge header logo and display brand name only ([#87](https://github.com/ismailagung/gradsun/issues/87)) ([133a1c9](https://github.com/ismailagung/gradsun/commit/133a1c97068960b3e4e89d3c9a122dd23de19ae0))
* **callsheets:** implement daily photographer shoot callsheets and operational studio dashboard analytics ([#56](https://github.com/ismailagung/gradsun/issues/56)) ([daa0d6e](https://github.com/ismailagung/gradsun/commit/daa0d6ec8244b172217eef1278062717c805d211))
* **cms:** auto-transcode and compress CMS uploaded images to WebP ([#109](https://github.com/ismailagung/gradsun/issues/109)) ([#110](https://github.com/ismailagung/gradsun/issues/110)) ([cbb6c06](https://github.com/ismailagung/gradsun/commit/cbb6c0638992868b98595c25dbe1622f7909ab88))
* **cms:** expand Homepage CMS to manage all section headers with full 1-page live preview ([#105](https://github.com/ismailagung/gradsun/issues/105)) ([#106](https://github.com/ismailagung/gradsun/issues/106)) ([056f4fe](https://github.com/ismailagung/gradsun/commit/056f4feb2e4716f0090cf0cdc3783394af55710d))
* **cms:** implement Gallery Portfolio CMS with photo showcase CRUD and public live sync ([#111](https://github.com/ismailagung/gradsun/issues/111)) ([#112](https://github.com/ismailagung/gradsun/issues/112)) ([34ff31e](https://github.com/ismailagung/gradsun/commit/34ff31e7213d28fa325cf743f47d28c51e92dcb9))
* **cms:** implement Homepage CMS for texts and non-gallery/non-package photos ([#101](https://github.com/ismailagung/gradsun/issues/101)) ([#102](https://github.com/ismailagung/gradsun/issues/102)) ([b22baf4](https://github.com/ismailagung/gradsun/commit/b22baf4b3e100c55db910cbd0c60ac16f5b22b07))
* **cms:** implement public-side CMS for Home, Gallery, Packages, and Track Order with Live Preview ([#97](https://github.com/ismailagung/gradsun/issues/97)) ([#98](https://github.com/ismailagung/gradsun/issues/98)) ([df0bb4f](https://github.com/ismailagung/gradsun/commit/df0bb4ff3df5bcd10a184981184acb35e83375ec))
* **cms:** persist Homepage CMS in Supabase database & media uploads ([#107](https://github.com/ismailagung/gradsun/issues/107)) ([#108](https://github.com/ismailagung/gradsun/issues/108)) ([5122e93](https://github.com/ismailagung/gradsun/commit/5122e93d8f23b6befe791ff51da7330169555413))
* **cms:** revamp Homepage CMS Live Preview with authentic 2-column arched showcase ([#103](https://github.com/ismailagung/gradsun/issues/103)) ([#104](https://github.com/ismailagung/gradsun/issues/104)) ([e0f2d9a](https://github.com/ismailagung/gradsun/commit/e0f2d9a57cf775eda7589cd164a9e348d9ccd0fb))
* **customers:** implement customer directory and lifetime value calculation repository slice ([#57](https://github.com/ismailagung/gradsun/issues/57)) ([f3337d8](https://github.com/ismailagung/gradsun/commit/f3337d8e227df4149bb31eee574a52bec4c48249))
* **galleries:** implement admin photo upload pipeline with automatic sharp webp resizing and watermark generation ([#54](https://github.com/ismailagung/gradsun/issues/54)) ([e4b264f](https://github.com/ismailagung/gradsun/commit/e4b264f7947a0c01c5de24b3cd9594b23035f9ce))
* **gallery:** iterative visual polish, header simplification, and card alignment ([#68](https://github.com/ismailagung/gradsun/issues/68)) ([39c4073](https://github.com/ismailagung/gradsun/commit/39c4073c37f01e185303893813ae023048529dcc))
* **gallery:** rebrand portfolio identity to gallery across navigation and pages ([#66](https://github.com/ismailagung/gradsun/issues/66)) ([56b2c28](https://github.com/ismailagung/gradsun/commit/56b2c28b61e54e7f36176d0c3a29f447b158790d))
* **invoicing:** implement printable and downloadable digital invoice page with bank transfer instructions and whatsapp dispatch ([#51](https://github.com/ismailagung/gradsun/issues/51)) ([778a6ef](https://github.com/ismailagung/gradsun/commit/778a6ef2821a7f311c0e009906dceebdca779af2))
* **landing:** iterative visual polish and copy adjustments for landing page ([#64](https://github.com/ismailagung/gradsun/issues/64)) ([257abed](https://github.com/ismailagung/gradsun/commit/257abed944068da4a7b14125068db98eb47e9ef9))
* **landing:** refine hero section copy, remove stats, and fix polaroid card border ([#61](https://github.com/ismailagung/gradsun/issues/61)) ([#62](https://github.com/ismailagung/gradsun/issues/62)) ([86250a3](https://github.com/ismailagung/gradsun/commit/86250a37274ae5de8d4c9b3f53e81c88caa051f6))
* **navigation:** add active route highlight indicator to public navbar ([#83](https://github.com/ismailagung/gradsun/issues/83)) ([#84](https://github.com/ismailagung/gradsun/issues/84)) ([54408a6](https://github.com/ismailagung/gradsun/commit/54408a6de955e456e904bb46321b5f0445750f37))
* **navigation:** relocate studio admin link to footer and update terms copy ([#74](https://github.com/ismailagung/gradsun/issues/74)) ([7b0b4aa](https://github.com/ismailagung/gradsun/commit/7b0b4aa7d5703ac4b5a223406a069b9a5d88d9c7))
* **notifications:** implement automated reminder cron jobs for upcoming sessions ([#59](https://github.com/ismailagung/gradsun/issues/59)) ([6fe61f9](https://github.com/ismailagung/gradsun/commit/6fe61f9f54a9092bffcd0526c93291b9cee2d13e))
* **packages:** implement Master Packages and Presentation CMS with authentic Gradsun packages ([#114](https://github.com/ismailagung/gradsun/issues/114), [#122](https://github.com/ismailagung/gradsun/issues/122))
* **packages:** iterative visual polish, 24h time picker, and reservation summary ([#70](https://github.com/ismailagung/gradsun/issues/70)) ([c9641ec](https://github.com/ismailagung/gradsun/commit/c9641ec1ba2b6f84ff6f6b9abe3720618d86793b))
* **proofing:** implement interactive client photo selection and order tracking portal ([#55](https://github.com/ismailagung/gradsun/issues/55)) ([d21b6a7](https://github.com/ismailagung/gradsun/commit/d21b6a79e82ad7e2b7f7b0e281803618e71ec256))
* **reservations:** implement booking creation use-case, repository, and safe action with dynamic slot reservation ([#50](https://github.com/ismailagung/gradsun/issues/50)) ([78e90b0](https://github.com/ismailagung/gradsun/commit/78e90b0639986b13144488497126a6ac4e29da16))
* **schema:** isolate schema migration for comprehensive reservations, invoice records, and manual payment tracking ([#48](https://github.com/ismailagung/gradsun/issues/48)) ([5aa4d10](https://github.com/ismailagung/gradsun/commit/5aa4d10cf2d3cebd65035d4ca89ebaacac492bc5))
* **schema:** isolate schema migration for photo galleries, proofing sessions, and client photo selections ([#53](https://github.com/ismailagung/gradsun/issues/53)) ([eb80457](https://github.com/ismailagung/gradsun/commit/eb804575a27a879c782fb5af74a0ed58bfcd05b8))
* **seo:** implement dynamic opengraph metadata, json-ld structured data, and sitemap for campus search visibility ([#60](https://github.com/ismailagung/gradsun/issues/60)) ([b6a840a](https://github.com/ismailagung/gradsun/commit/b6a840a13429dfeecf6d41a26cf4bd677591f593))
* **track-order:** comprehensive order tracking UI with status timeline, client details, and invoice download ([#72](https://github.com/ismailagung/gradsun/issues/72)) ([06cd4bf](https://github.com/ismailagung/gradsun/commit/06cd4bf39dac4a839a183e677cb9b9eebfcb0862))


### Bug Fixes

* **branding:** retain original logo dimensions while displaying brand name only ([#90](https://github.com/ismailagung/gradsun/issues/90)) ([a527c8d](https://github.com/ismailagung/gradsun/commit/a527c8d323dc71343d4e1cc368b4e6071e894ff8))
* **home:** resolve button contrast and invisible label in manifesto banner ([#81](https://github.com/ismailagung/gradsun/issues/81)) ([#82](https://github.com/ismailagung/gradsun/issues/82)) ([335f84a](https://github.com/ismailagung/gradsun/commit/335f84a1f87976bbcc30fa9b0e21ff90d730d0db))
* **home:** resolve hero card transparency and map tailwind v4 theme tokens ([#77](https://github.com/ismailagung/gradsun/issues/77)) ([793892d](https://github.com/ismailagung/gradsun/commit/793892d76ccd849dbcd0b10d884d481e95d0e1b6))
* **theme:** restore neutral base palette and eliminate golden color shift ([#80](https://github.com/ismailagung/gradsun/issues/80)) ([8fc7a2b](https://github.com/ismailagung/gradsun/commit/8fc7a2b988e679bbebd31ac3bb9ea33bb6c8b6e8))

## [0.4.0](https://github.com/najmialazhar/gradsun/compare/gradsun-v0.3.0...gradsun-v0.4.0) (2026-11-22)


### Features

* **database:** configure supabase pooled/direct urls and baseline schema ([#4](https://github.com/najmialazhar/gradsun/issues/4)) ([74a843f](https://github.com/najmialazhar/gradsun/commit/74a843fce22874e8f1b5ceeb0ba32702416b4f1d)), closes [#3](https://github.com/najmialazhar/gradsun/issues/3)
* **database:** define master data domain models and relations ([#21](https://github.com/najmialazhar/gradsun/issues/21)) ([f43975b](https://github.com/najmialazhar/gradsun/commit/f43975b797447445a302ba1a3261eaded4e84d6b)), closes [#12](https://github.com/najmialazhar/gradsun/issues/12)
* **governance:** implement ast guardrails and agents mandate ([#6](https://github.com/najmialazhar/gradsun/issues/6)) ([b81dcd3](https://github.com/najmialazhar/gradsun/commit/b81dcd38aff0037085febd72018452f1a4dd19f2)), closes [#5](https://github.com/najmialazhar/gradsun/issues/5)
* initial project setup ([efe61be](https://github.com/najmialazhar/gradsun/commit/efe61beda397ca0b72245541d9b925360e1e94ab))
* **packages:** implement packages domain slice with repository, use-cases, and safe actions ([#42](https://github.com/najmialazhar/gradsun/issues/42)) ([95ecfb1](https://github.com/najmialazhar/gradsun/commit/95ecfb1348b15df2cfa76e4e3da3a16ccce44401))
* **presentation:** add root layout, page, i18n dictionaries, and module structure ([#10](https://github.com/najmialazhar/gradsun/issues/10)) ([2523ff7](https://github.com/najmialazhar/gradsun/commit/2523ff7ba039b04404b766e84a5c68f38762677d)), closes [#9](https://github.com/najmialazhar/gradsun/issues/9)
* **reservations:** implement slot-calculator and pricing-calculator domain services ([#13](https://github.com/najmialazhar/gradsun/issues/13)) ([#25](https://github.com/najmialazhar/gradsun/issues/25)) ([bbb193b](https://github.com/najmialazhar/gradsun/commit/bbb193b7f747b20f270ea3f8b319a387717bba65))
* **seed:** implement realistic idempotent database seeders for commencement packages, add-ons, and studio rooms ([#47](https://github.com/najmialazhar/gradsun/issues/47)) ([ab5d547](https://github.com/najmialazhar/gradsun/commit/ab5d5476745581a823dd1d01caeceb8a118cecbc))
* **storage:** setup supabase s3 client and sharp webp watermarking pipeline ([#14](https://github.com/najmialazhar/gradsun/issues/14)) ([#26](https://github.com/najmialazhar/gradsun/issues/26)) ([e3a7d2f](https://github.com/najmialazhar/gradsun/commit/e3a7d2f46ef827c5ffdbac5394f71f196ff48df2))
* **studios:** implement studio rooms and blackout dates domain slice with repository and actions ([#46](https://github.com/najmialazhar/gradsun/issues/46)) ([f0ba7da](https://github.com/najmialazhar/gradsun/commit/f0ba7daf07a8bd7d629439223a315b909db1809b))
* **ui:** implement complete public and admin ui framework for [#23](https://github.com/najmialazhar/gradsun/issues/23) ([#24](https://github.com/najmialazhar/gradsun/issues/24)) ([1ec032d](https://github.com/najmialazhar/gradsun/commit/1ec032d34fe4b6bf52e4ec1ab6c1ace83fc192a3))
* **ui:** install core shadcn/ui radix-nova primitives in common components ([79c121b](https://github.com/najmialazhar/gradsun/commit/79c121b3ca0938b2429f079414555cc45a7a8427))


### Bug Fixes

* **ci:** lock swc helpers, add prisma generation, and configure ci env validation ([90ca122](https://github.com/najmialazhar/gradsun/commit/90ca122a1f2213310b29f737cfa2fd3c1b2b36e8))


### Documentation

* **architecture:** add diataxis suite, adrs, ci workflow, and agent skills ([#8](https://github.com/najmialazhar/gradsun/issues/8)) ([bd70a61](https://github.com/najmialazhar/gradsun/commit/bd70a61af5dde7aaa2924da3d125017b4b909be0)), closes [#7](https://github.com/najmialazhar/gradsun/issues/7)
* modernize root readme with architecture overview, tech stack, and quality gates ([d96faab](https://github.com/najmialazhar/gradsun/commit/d96faab2f1cb7c069b40c032cc5d374e74ff597e))


### Miscellaneous Chores

* **docs:** prune obsolete scaffolding blueprints and legacy audit notes ([a08e5ba](https://github.com/najmialazhar/gradsun/commit/a08e5bada2aa4aa30cabb9ea2280ceb19e8ec79c))
* **git:** refine gitignore with enterprise os, editor, and log exclusions ([f560597](https://github.com/najmialazhar/gradsun/commit/f5605979fa67f3adce232da1d3889a562c31e1c2))
* **governance:** enforce agent issue-first workflow, semver release advisory, and package rename to gradsun ([#44](https://github.com/najmialazhar/gradsun/issues/44)) ([7c784b7](https://github.com/najmialazhar/gradsun/commit/7c784b701333096650288fa01769cc6b113dd7b2))
* **governance:** setup semantic pr validation and release-please automation ([1424ef5](https://github.com/najmialazhar/gradsun/commit/1424ef52708ed064170de0e544a4b13f58b6b08c))
* **main:** release photo-reserve 0.2.0 ([#19](https://github.com/najmialazhar/gradsun/issues/19)) ([7a40441](https://github.com/najmialazhar/gradsun/commit/7a404413d0863dbf94349f3a01ab164dbb9f5f9b))
* **main:** release photo-reserve 0.3.0 ([#22](https://github.com/najmialazhar/gradsun/issues/22)) ([ec77194](https://github.com/najmialazhar/gradsun/commit/ec77194b5164c8db65a706c4ace9d60875253b9c))
* **toolchain:** bootstrap next.js 15 toolchain, env validation, and styling ([#2](https://github.com/najmialazhar/gradsun/issues/2)) ([ebfac41](https://github.com/najmialazhar/gradsun/commit/ebfac41002d250337eb8f8282fde371956df1fe9)), closes [#1](https://github.com/najmialazhar/gradsun/issues/1)
* **toolchain:** ignore legacy audit notes in biome linter ([c264297](https://github.com/najmialazhar/gradsun/commit/c264297bb8d60281049303125d5600eb0ff252c0))
* **toolchain:** prune default create-next-app boilerplate assets and unused svgs ([#41](https://github.com/najmialazhar/gradsun/issues/41)) ([81e3dd9](https://github.com/najmialazhar/gradsun/commit/81e3dd9012b9cafcf0fe2d16816d0c57cd8ca7ad))

## [0.3.0](https://github.com/najmialazhar/gradsun/compare/photo-reserve-v0.2.0...photo-reserve-v0.3.0) (2026-11-21)


### Features

* **database:** define master data domain models and relations ([#21](https://github.com/najmialazhar/gradsun/issues/21)) ([f43975b](https://github.com/najmialazhar/gradsun/commit/f43975b797447445a302ba1a3261eaded4e84d6b)), closes [#12](https://github.com/najmialazhar/gradsun/issues/12)
* **packages:** implement packages domain slice with repository, use-cases, and safe actions ([#42](https://github.com/najmialazhar/gradsun/issues/42)) ([95ecfb1](https://github.com/najmialazhar/gradsun/commit/95ecfb1348b15df2cfa76e4e3da3a16ccce44401))
* **reservations:** implement slot-calculator and pricing-calculator domain services ([#13](https://github.com/najmialazhar/gradsun/issues/13)) ([#25](https://github.com/najmialazhar/gradsun/issues/25)) ([bbb193b](https://github.com/najmialazhar/gradsun/commit/bbb193b7f747b20f270ea3f8b319a387717bba65))
* **storage:** setup supabase s3 client and sharp webp watermarking pipeline ([#14](https://github.com/najmialazhar/gradsun/issues/14)) ([#26](https://github.com/najmialazhar/gradsun/issues/26)) ([e3a7d2f](https://github.com/najmialazhar/gradsun/commit/e3a7d2f46ef827c5ffdbac5394f71f196ff48df2))
* **ui:** implement complete public and admin ui framework for [#23](https://github.com/najmialazhar/gradsun/issues/23) ([#24](https://github.com/najmialazhar/gradsun/issues/24)) ([1ec032d](https://github.com/najmialazhar/gradsun/commit/1ec032d34fe4b6bf52e4ec1ab6c1ace83fc192a3))


### Miscellaneous Chores

* **toolchain:** prune default create-next-app boilerplate assets and unused svgs ([#41](https://github.com/najmialazhar/gradsun/issues/41)) ([81e3dd9](https://github.com/najmialazhar/gradsun/commit/81e3dd9012b9cafcf0fe2d16816d0c57cd8ca7ad))

## [0.2.0](https://github.com/najmialazhar/gradsun/compare/photo-reserve-v0.1.0...photo-reserve-v0.2.0) (2026-11-18)


### Features

* **database:** configure supabase pooled/direct urls and baseline schema ([#4](https://github.com/najmialazhar/gradsun/issues/4)) ([74a843f](https://github.com/najmialazhar/gradsun/commit/74a843fce22874e8f1b5ceeb0ba32702416b4f1d)), closes [#3](https://github.com/najmialazhar/gradsun/issues/3)
* **governance:** implement ast guardrails and agents mandate ([#6](https://github.com/najmialazhar/gradsun/issues/6)) ([b81dcd3](https://github.com/najmialazhar/gradsun/commit/b81dcd38aff0037085febd72018452f1a4dd19f2)), closes [#5](https://github.com/najmialazhar/gradsun/issues/5)
* initial project setup ([efe61be](https://github.com/najmialazhar/gradsun/commit/efe61beda397ca0b72245541d9b925360e1e94ab))
* **presentation:** add root layout, page, i18n dictionaries, and module structure ([#10](https://github.com/najmialazhar/gradsun/issues/10)) ([2523ff7](https://github.com/najmialazhar/gradsun/commit/2523ff7ba039b04404b766e84a5c68f38762677d)), closes [#9](https://github.com/najmialazhar/gradsun/issues/9)
* **ui:** install core shadcn/ui radix-nova primitives in common components ([79c121b](https://github.com/najmialazhar/gradsun/commit/79c121b3ca0938b2429f079414555cc45a7a8427))


### Bug Fixes

* **ci:** lock swc helpers, add prisma generation, and configure ci env validation ([90ca122](https://github.com/najmialazhar/gradsun/commit/90ca122a1f2213310b29f737cfa2fd3c1b2b36e8))


### Documentation

* **architecture:** add diataxis suite, adrs, ci workflow, and agent skills ([#8](https://github.com/najmialazhar/gradsun/issues/8)) ([bd70a61](https://github.com/najmialazhar/gradsun/commit/bd70a61af5dde7aaa2924da3d125017b4b909be0)), closes [#7](https://github.com/najmialazhar/gradsun/issues/7)
* modernize root readme with architecture overview, tech stack, and quality gates ([d96faab](https://github.com/najmialazhar/gradsun/commit/d96faab2f1cb7c069b40c032cc5d374e74ff597e))


### Miscellaneous Chores

* **docs:** prune obsolete scaffolding blueprints and legacy audit notes ([a08e5ba](https://github.com/najmialazhar/gradsun/commit/a08e5bada2aa4aa30cabb9ea2280ceb19e8ec79c))
* **git:** refine gitignore with enterprise os, editor, and log exclusions ([f560597](https://github.com/najmialazhar/gradsun/commit/f5605979fa67f3adce232da1d3889a562c31e1c2))
* **governance:** setup semantic pr validation and release-please automation ([1424ef5](https://github.com/najmialazhar/gradsun/commit/1424ef52708ed064170de0e544a4b13f58b6b08c))
* **toolchain:** bootstrap next.js 15 toolchain, env validation, and styling ([#2](https://github.com/najmialazhar/gradsun/issues/2)) ([ebfac41](https://github.com/najmialazhar/gradsun/commit/ebfac41002d250337eb8f8282fde371956df1fe9)), closes [#1](https://github.com/najmialazhar/gradsun/issues/1)
* **toolchain:** ignore legacy audit notes in biome linter ([c264297](https://github.com/najmialazhar/gradsun/commit/c264297bb8d60281049303125d5600eb0ff252c0))
