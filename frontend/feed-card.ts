/// <reference path="type.ts"/>

function make_card({ bvid, cover, views, danmaku, duration, title, mid, author, posttime }: Param): string {
	return `\
<div class="feed-card">
	<div class="bili-video-card is-rcmd">
		<div class="bili-video-card__skeleton hide">
			<div class="bili-video-card__skeleton--cover"></div>
			<div class="bili-video-card__skeleton--info">
				<div class="bili-video-card__skeleton--right">
					<p class="bili-video-card__skeleton--text"></p>
					<p class="bili-video-card__skeleton--text short"></p>
					<p class="bili-video-card__skeleton--light"></p>
				</div>
			</div>
		</div>
		<div class="bili-video-card__wrap __scale-wrap">
			<a href="https://www.bilibili.com/video/${bvid}" target="_blank" rel="noopener">
				<div class="bili-video-card__image __scale-player-wrap">
					<div class="bili-video-card__image--wrap">
						<picture class="v-img bili-video-card__cover">
							<img src="${cover}@672w_378h_1c_!web-home-common-cover">
						</picture>
					</div>
					<div class="bili-video-card__mask">
						<div class="bili-video-card__stats">
							<div class="bili-video-card__stats--left">
								<span class="bili-video-card__stats--item">
									<svg class="bili-video-card__stats--icon">
										<use xlink:href="#widget-video-play-count"></use>
									</svg>
									<span class="bili-video-card__stats--text">${views}</span>
								</span>
								<span class="bili-video-card__stats--item">
									<svg class="bili-video-card__stats--icon">
										<use xlink:href="#widget-video-danmaku"></use>
									</svg>
									<span class="bili-video-card__stats--text">${danmaku}</span>
								</span>
							</div>
							<span class="bili-video-card__stats__duration">${duration}</span>
						</div>
					</div>
				</div>
			</a>
			<div class="bili-video-card__info __scale-disable">
				<div class="bili-video-card__info--right">
					<h3 class="bili-video-card__info--tit" title="${title}">
						<a href="https://www.bilibili.com/video/${bvid}" target="_blank" rel="noopener">${title}</a>
					</h3>
					<div class="bili-video-card__info--bottom">
						<a class="bili-video-card__info--owner" href="https://space.bilibili.com/${mid}" target="_blank">
							<svg class="bili-video-card__info--owner__up">
								<use xlink:href="#widget-up"></use>
							</svg>
							<span class="bili-video-card__info--author">${author}</span>
							<span class="bili-video-card__info--posttime">· ${posttime}</span>
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>\
`
}