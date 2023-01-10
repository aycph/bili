/// <reference path="type.ts"/>

function make_card({ bvid, cover, views, danmaku, duration, title, mid, author, posttime }: Param): string {
	return `
<div class="col_3 col_xs_1_5 col_md_2 col_xl_1_7 mb_x40" data-v-60dc383e="">
	<div class="bili-video-card" data-v-60dc383e="" data-v-dec592ec="">
		<div class="hide bili-video-card__skeleton" data-v-dec592ec="">
			<div class="bili-video-card__skeleton--cover" data-v-dec592ec=""></div>
			<div class="bili-video-card__skeleton--info" data-v-dec592ec="">
				<div class="bili-video-card__skeleton--right" data-v-dec592ec="">
					<p class="bili-video-card__skeleton--text" data-v-dec592ec=""></p>
					<p class="bili-video-card__skeleton--text short" data-v-dec592ec=""></p>
					<p class="bili-video-card__skeleton--light" data-v-dec592ec=""></p>
				</div>
			</div>
		</div>
		<div class="bili-video-card__wrap __scale-wrap" data-v-dec592ec="">
			<a
				href="https://www.bilibili.com/video/${bvid}/" class="" target="_blank"
				data-v-dec592ec="" data-mod="search-card" data-idx="all" data-ext="click">
				<div class="bili-video-card__image __scale-player-wrap" data-v-dec592ec="">
					<div class="bili-video-card__image--wrap" data-v-dec592ec="">
						<div class="bili-watch-later" style="display: none;">
							<svg class="bili-watch-later__icon">
								<use xlink:href="#widget-watch-later"></use>
							</svg>
						</div>
						<picture class="v-img bili-video-card__cover" data-v-dec592ec="">
							<source
								srcset="${cover}@672w_378h_1c_!web-search-common-cover.avif"
								type="image/avif">
							<source
								srcset="${cover}@672w_378h_1c_!web-search-common-cover.webp"
								type="image/webp">
							<img "${cover}@672w_378h_1c_!web-search-common-cover"
								alt="${title}" loading="lazy" onload="">
						</picture>
						<div class="v-inline-player"></div>
					</div>
					<div class="bili-video-card__mask" data-v-dec592ec="">
						<div class="bili-video-card__stats" data-v-dec592ec="">
							<div class="bili-video-card__stats--left" data-v-dec592ec="">
								<span class="bili-video-card__stats--item" data-v-dec592ec="">
									<svg class="bili-video-card__stats--icon" data-v-dec592ec="">
										<use xlink:href="#widget-video-play-count"></use>
									</svg>
									<span data-v-dec592ec="">${views}</span>
								</span>
								<span class="bili-video-card__stats--item" data-v-dec592ec="">
									<svg class="bili-video-card__stats--icon" data-v-dec592ec="">
										<use xlink:href="#widget-video-danmaku"></use>
									</svg>
									<span data-v-dec592ec="">${danmaku}</span>
								</span>
							</div>
							<span class="bili-video-card__stats__duration" data-v-dec592ec="">${duration}</span>
						</div>
					</div>
				</div>
			</a>
			<div class="bili-video-card__info __scale-disable" data-v-dec592ec="">
				<div class="bili-video-card__info--right" data-v-dec592ec="">
					<a
						href="https://www.bilibili.com/video/${bvid}/" target="_blank" data-v-dec592ec=""
						data-mod="search-card" data-idx="all" data-ext="click">
						<h3 class="bili-video-card__info--tit" title="${title}"
							data-v-dec592ec="">${title}</h3>
					</a>
					<p class="bili-video-card__info--bottom" data-v-dec592ec="">
						<a
							class="bili-video-card__info--owner" href="https://space.bilibili.com/${mid}"
							target="_blank" data-v-dec592ec="" data-mod="search-card" data-idx="all"
							data-ext="click">
							<svg class="bili-video-card__info--author-ico mr_2"
								data-v-dec592ec="">
								<use xlink:href="#widget-up"></use>
							</svg>
							<span class="bili-video-card__info--author" data-v-dec592ec="">${author}</span>
							<span class="bili-video-card__info--date" data-v-dec592ec=""> · ${posttime}</span>
						</a>
					</p>
				</div>
			</div>
		</div>
	</div>
</div>
`
}