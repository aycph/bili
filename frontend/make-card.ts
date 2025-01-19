/// <reference path="type.ts"/>

function make_card({ bvid, cover, views, danmaku, duration, title, mid, author, posttime }: Param): string {
	title = title.replace(/\"/g, '&quot;');
	return `\
<div class="col_3 col_xs_1_5 col_md_2 col_xl_1_7 mb_x40" data-v-97dcc362="">
	<div class="bili-video-card" data-v-97dcc362="" data-v-15c84221="">
		<div class="hide bili-video-card__skeleton" data-v-15c84221="">
			<div class="bili-video-card__skeleton--cover" data-v-15c84221=""></div>
			<div class="bili-video-card__skeleton--info" data-v-15c84221="">
				<div class="bili-video-card__skeleton--right" data-v-15c84221="">
					<p class="bili-video-card__skeleton--text" data-v-15c84221=""></p>
					<p class="bili-video-card__skeleton--text short" data-v-15c84221=""></p>
					<p class="bili-video-card__skeleton--light" data-v-15c84221=""></p>
				</div>
			</div>
		</div>
		<div class="bili-video-card__wrap __scale-wrap" data-v-15c84221="">
			<a href="https://www.bilibili.com/video/${bvid}/" target="_blank" data-v-15c84221="" data-mod="search-card" data-idx="all" data-ext="click">
				<div class="bili-video-card__image __scale-player-wrap" data-v-15c84221="">
					<div class="bili-video-card__image--wrap" data-v-15c84221="">
						<picture class="v-img bili-video-card__cover" data-v-15c84221="">
							<source srcset="${cover}@672w_378h_1c_!web-search-common-cover.avif" type="image/avif">
							<source srcset="${cover}@672w_378h_1c_!web-search-common-cover.webp" type="image/webp">
							<img src="${cover}@672w_378h_1c_!web-search-common-cover" alt="${title}" loading="lazy">
						</picture>
					</div>
					<div class="bili-video-card__mask" data-v-15c84221="">
						<div class="bili-video-card__stats" data-v-15c84221="">
							<div class="bili-video-card__stats--left" data-v-15c84221="">
								<span class="bili-video-card__stats--item" data-v-15c84221="">
									<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
										viewBox="0 0 24 24" width="24" height="24" fill="#ffffff" class="bili-video-card__stats--icon"
										data-v-15c84221=""><!--[-->
										<path d="M12 4.99805C9.48178 4.99805 7.283 5.12616 5.73089 5.25202C4.65221 5.33949 3.81611 6.16352 3.72 7.23254C3.60607 8.4998 3.5 10.171 3.5 11.998C3.5 13.8251 3.60607 15.4963 3.72 16.76355C3.81611 17.83255 4.65221 18.6566 5.73089 18.7441C7.283 18.8699 9.48178 18.998 12 18.998C14.5185 18.998 16.7174 18.8699 18.2696 18.74405C19.3481 18.65655 20.184 17.8328 20.2801 16.76405C20.394 15.4973 20.5 13.82645 20.5 11.998C20.5 10.16965 20.394 8.49877 20.2801 7.23205C20.184 6.1633 19.3481 5.33952 18.2696 5.25205C16.7174 5.12618 14.5185 4.99805 12 4.99805zM5.60965 3.75693C7.19232 3.62859 9.43258 3.49805 12 3.49805C14.5677 3.49805 16.8081 3.62861 18.3908 3.75696C20.1881 3.90272 21.6118 5.29278 21.7741 7.09773C21.8909 8.3969 22 10.11405 22 11.998C22 13.88205 21.8909 15.5992 21.7741 16.8984C21.6118 18.7033 20.1881 20.09335 18.3908 20.23915C16.8081 20.3675 14.5677 20.498 12 20.498C9.43258 20.498 7.19232 20.3675 5.60965 20.2392C3.81206 20.0934 2.38831 18.70295 2.22603 16.8979C2.10918 15.5982 2 13.8808 2 11.998C2 10.1153 2.10918 8.39787 2.22603 7.09823C2.38831 5.29312 3.81206 3.90269 5.60965 3.75693z" fill="currentColor"></path>
										<path d="M14.7138 10.96875C15.50765 11.4271 15.50765 12.573 14.71375 13.0313L11.5362 14.8659C10.74235 15.3242 9.75 14.7513 9.75001 13.8346L9.75001 10.1655C9.75001 9.24881 10.74235 8.67587 11.5362 9.13422L14.7138 10.96875z" fill="currentColor"></path><!--]-->
									</svg>
									<span data-v-15c84221="">${views}</span>
								</span>
								<span class="bili-video-card__stats--item" data-v-15c84221="">
									<svg class="bili-video-card__stats--icon" data-v-15c84221="">
										<use xlink:href="#widget-video-danmaku"></use>
									</svg>
									<span data-v-15c84221="">${danmaku}</span>
								</span>
							</div>
							<span class="bili-video-card__stats__duration" data-v-15c84221="">${duration}</span>
						</div>
					</div>
				</div>
			</a>
			<div class="bili-video-card__info __scale-disable" data-v-15c84221="">
				<div class="bili-video-card__info--right" data-v-15c84221="">
					<a href="https://www.bilibili.com/video/${bvid}/" target="_blank" data-v-15c84221="" data-mod="search-card" data-idx="all" data-ext="click">
						<h3 class="bili-video-card__info--tit" title="${title}" data-v-15c84221="">${title}</h3>
					</a>
					<p class="bili-video-card__info--bottom" data-v-15c84221="">
						<a class="bili-video-card__info--owner" href="https://space.bilibili.com/${mid}" target="_blank" data-v-15c84221="" data-mod="search-card"
							data-idx="all" data-ext="click">
							<svg class="bili-video-card__info--author-ico mr_2" data-v-15c84221="">
								<use xlink:href="#widget-up"></use>
							</svg>
							<span class="bili-video-card__info--author" data-v-15c84221="">${author}</span>
							<span class="bili-video-card__info--date" data-v-15c84221=""> · ${posttime}</span>
						</a>
					</p>
				</div>
			</div>
		</div>
	</div>
</div>
`;
}

function make_live({ mid, name, level, roomid, face, sign, title }: LiveParam) {
	return `\
<div class="b-user-video-card p_relative not_100" data-v-89583ab2="" data-v-1cd59021="" data-report="search-card.all">
	<div class="video-card-content i_wrapper" data-v-1cd59021="">
		<div class="user-info flex_start p_relative" data-v-1cd59021="">
			<div class="info-card flex_start" data-v-1cd59021="">
				<a href="https://live.bilibili.com/${roomid}" target="_blank" data-v-1cd59021="">
					<div data-v-766b7086="" data-v-1cd59021="" class="search-user-avatar p_relative avatar-small mr_md cs_pointer">
						<div data-v-766b7086="" class="avatar-wrap p_relative live-ani">
							<div data-v-766b7086="" class="avatar-inner">
								<div class="bili-avatar" style="width: 86px;height:86px;transform: translate(0px, 0px);">
									<img class="bili-avatar-img bili-avatar-face bili-avatar-img-radius"
										data-src="${face}@240w_240h_1c_1s_!web-avatar-search-videos.webp"
										alt=""
										src="${face}@240w_240h_1c_1s_!web-avatar-search-videos.webp">
									<span class="bili-avatar-icon bili-avatar-right-icon  bili-avatar-size-86"></span>
								</div>
							</div>
							<div data-v-766b7086="" class="a-cycle a-cycle-1"></div>
							<div data-v-766b7086="" class="a-cycle a-cycle-2"></div>
							<div data-v-766b7086="" class="a-cycle a-cycle-3"></div>
						</div>
						<div data-v-766b7086="" class="live-tab p_center_x text_white bg_brand_pink bd_radius_md fs_6 flex_center text_nowrap">
							<img data-v-766b7086="" class="live-gif w_md mr_xs" src="data:image/gif;base64,R0lGODlhJAAkAIABAP///wAAACH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDYuMC1jMDAyIDc5LjE2NDQ2MCwgMjAyMC8wNS8xMi0xNjowNDoxNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjIgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDdCNUJFRjlGQjIzMTFFQTgzNjRCQUFBRjZFMzg3NjUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MDdCNUJFRkFGQjIzMTFFQTgzNjRCQUFBRjZFMzg3NjUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowN0I1QkVGN0ZCMjMxMUVBODM2NEJBQUFGNkUzODc2NSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowN0I1QkVGOEZCMjMxMUVBODM2NEJBQUFGNkUzODc2NSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgH//v38+/r5+Pf29fTz8vHw7+7t7Ovq6ejn5uXk4+Lh4N/e3dzb2tnY19bV1NPS0dDPzs3My8rJyMfGxcTDwsHA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" alt="live">
							直播中
						</div>
					</div>
				</a>
				<div class="user-content p_relative" data-v-1cd59021="">
					<h2 class="b_text i_card_title mt_0" data-v-1cd59021="">
						<a class="user-name cs_pointer v_align_middle" href="https://space.bilibili.com/${mid}" target="_blank" data-v-1cd59021="">
							${name}
							<svg class="level-icon ml_sm" data-v-1cd59021="" data-v-fec65f0c="">
								<use xlink:href="#lv_${level}"></use>
							</svg>
						</a>
						<div class="user-actions d_inline_block" data-v-1cd59021="">
							<button data-v-1cd59021="" class="vui_button vui_button--blue"> + 关注 </button>
						</div>
					</h2>
					<p class="b_text text2 text_ellipsis user-video-desc" data-v-1cd59021="">
						${title}
						<span class="user-video-desc-text" data-v-1cd59021="">${sign}</span>
					</p>
				</div>
			</div>
		</div>
	</div>
</div>
`;
}

function make_live_bottom() {
	return `\
<div class="i_wrapper p_relative" data-v-89583ab2="">
	<div class="card-bottom" data-v-89583ab2=""></div>
</div>
`;
}

function make_btn(i: number, page: number, render: (page: number) => void) {
	const btn = document.createElement('button');
	btn.className = `vui_button vui_button--no-transition vui_pagenation--btn vui_pagenation--btn-num ${i === page ?'vui_button--active vui_button--active-blue' : ''}`;
	btn.innerText = i.toString();
	btn.onclick = () => render(i); // 也无需判断 page !== i
	return btn;
}

function make_side_btns(page: number, pages: number, text: '上一页' | '下一页', render: (page: number) => void): HTMLButtonElement {
	const btn = document.createElement('button');
	btn.className = 'vui_button vui_button--disabled vui_pagenation--btn vui_pagenation--btn-side';
	btn.disabled = text === '上一页' ? page === 1 : page === pages;
	btn.innerText = text;
	btn.onclick = () => render(text === '上一页' ? page - 1 : page + 1);
	return btn;
}

function make_ellipsis() {
	const e = document.createElement('span');
	e.className = 'vui_pagenation--extend';
	e.innerText = '...';
	return e;
}

function make_paginations(videos: Param[], num_per_page: number, page: number, render: (page: number) => void): HTMLElement[] {
	const pages = Math.ceil(videos.length / num_per_page);
	if (pages < 10) {
		return [
			make_side_btns(page, pages, '上一页', render),
			...Array(pages).fill(0).map((_, i) => make_btn(i+1, page, render)),
			make_side_btns(page, pages, '下一页', render),
		];
	} else {
		if (page < 6) {
			// 1 - 7 … pages
			return [
				make_side_btns(page, pages, '上一页', render),
				...[1,2,3,4,5,6,7].map(i => make_btn(i, page, render)),
				make_ellipsis(),
				make_btn(pages, page, render),
				make_side_btns(page, pages, '下一页', render),
			];
		} else if (page > pages - 5) {
			// 1 … pages-6 - pages
			return [
				make_side_btns(page, pages, '上一页', render),
				make_btn(1, page, render),
				make_ellipsis(),
				...[6,5,4,3,2,1,0].map(i => make_btn(pages-i, page, render)),
				make_side_btns(page, pages, '下一页', render),
			];
		} else {
			// 显示 1 … idx-2 idx-1 idx idx+1 idx+2 … pages
			return [
				make_side_btns(page, pages, '上一页', render),
				make_btn(1, page, render),
				make_ellipsis(),
				...[-2,-1,0,1,2].map(i => make_btn(page+i, page, render)),
				make_ellipsis(),
				make_btn(pages, page, render),
				make_side_btns(page, pages, '下一页', render),
			];
		}
	}
}

function make_head(active_name: string, groups_name: string[], render: (name: string) => void) {
	return groups_name.map(name => {
		const innerHTML = `<button class="vui_button vui_button--tab ${active_name === name && 'vui_button--active'} mr_sm" data-v-190300f0="">${name}</button>`;
		const e = createElement<'button'>(innerHTML);
		e.onclick = () => render(name);
		return e;
	})
}
