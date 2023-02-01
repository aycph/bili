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

function make_live({ mid, name, roomid, face, sign, title }: LiveParam) {
	return `
<div class="b-user-video-card p_relative not_100" data-v-6182da82="" data-v-657aea76="" data-report="search-card.all"><!---->
	<div class="video-card-content i_wrapper" data-v-6182da82="">
		<div class="user-info flex_start p_relative" data-v-6182da82="">
			<div class="info-card flex_start" data-v-6182da82="">
				<a href="https://live.bilibili.com/${roomid}" target="_blank" data-v-6182da82="">
					<div class="search-user-avatar p_relative avatar-small mr_md cs_pointer" data-v-0d1a0946="" data-v-6182da82="">
						<div class="avatar-wrap p_relative live-ani" data-v-0d1a0946="">
							<div class="avatar-inner" data-v-0d1a0946="">
								<div class="bili-avatar" style="width: 86px;height:86px;transform: translate(0px, 0px);">
									<img class="bili-avatar-img bili-avatar-face bili-avatar-img-radius"
										data-src="${face}@240w_240h_1c_1s.webp"
										alt=""
										src="${face}@240w_240h_1c_1s.webp">
									<span class="bili-avatar-icon bili-avatar-right-icon  bili-avatar-size-86"></span>
								</div>
							</div>
							<div class="a-cycle a-cycle-1" data-v-0d1a0946=""></div>
							<div class="a-cycle a-cycle-2" data-v-0d1a0946=""></div>
							<div class="a-cycle a-cycle-3" data-v-0d1a0946=""></div>
						</div>
						<div class="live-tab p_center_x text_white bg_brand_pink bd_radius_md fs_6 flex_center text_nowrap" data-v-0d1a0946=""><img class="live-gif w_md mr_xs"
								src="data:image/gif;base64,R0lGODlhJAAkAIABAP///wAAACH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDYuMC1jMDAyIDc5LjE2NDQ2MCwgMjAyMC8wNS8xMi0xNjowNDoxNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjIgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDdCNUJFRjlGQjIzMTFFQTgzNjRCQUFBRjZFMzg3NjUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MDdCNUJFRkFGQjIzMTFFQTgzNjRCQUFBRjZFMzg3NjUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowN0I1QkVGN0ZCMjMxMUVBODM2NEJBQUFGNkUzODc2NSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowN0I1QkVGOEZCMjMxMUVBODM2NEJBQUFGNkUzODc2NSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgH//v38+/r5+Pf29fTz8vHw7+7t7Ovq6ejn5uXk4+Lh4N/e3dzb2tnY19bV1NPS0dDPzs3My8rJyMfGxcTDwsHAv769vLu6ubi3trW0s7KxsK+urayrqqmop6alpKOioaCfnp2cm5qZmJeWlZSTkpGQj46NjIuKiYiHhoWEg4KBgH9+fXx7enl4d3Z1dHNycXBvbm1sa2ppaGdmZWRjYmFgX15dXFtaWVhXVlVUU1JRUE9OTUxLSklIR0ZFRENCQUA/Pj08Ozo5ODc2NTQzMjEwLy4tLCsqKSgnJiUkIyIhIB8eHRwbGhkYFxYVFBMSERAPDg0MCwoJCAcGBQQDAgEAACH5BAkDAAEALAAAAAAkACQAAAJvjI+py+0Po5y02quABhhu3TUfGC4jV2Zjqn5scr5ILBs0vF337Fa7vfIFeT3KL3D0DA/Jx7HpeC6ZuVaVeMWitFtq0ZsFfsVh5NQ8Rpelafb67CZxrXJwnXxX5+NdfF//x0cXCHeGJpLnVbPI+FIAACH5BAkDAAEALAAAAAAkACQAAAJrjI+py+0Po5y02rsAlqDr3XgeyIgdmZmoYn7r0b5ILBt0fcv5vO32aPH5IEJVpSgqhYwzZvPEcv6SCSTweYVJA1Yo1qulfl3h7NTM3XbJZ3CbnRaX3XH0Oip/4+3qfr5Od4e3BBdWc4j4UgAAIfkECQMAAQAsAAAAACQAJAAAAmiMj6nL7Q+jnLTai7OeoIPNeB6oiB2ZmB96qGxrvoYr06/N4qiOrBYfEDVOCx5QWIqllD0mDNmEPkdL6cx5tQaxW62R+/WCx+IyNXqeEtFrtc+dNLezafq8W8ffw3n+vTv0lyVDWLhRAAAh+QQJAwABACwAAAAAJAAkAAACaYyPqcvtD6OctNqLs95cgc4A4gci41gep5gaK5m+bSC3dbxmcHJT59KTBGk54M5URP48KOZS2YSyeElV1XUlPq1bbFcb5Ya9Y/BUejSnh+xs+/sux89iOtmudsrdfHi/rNUA6DVTaIhRAAAh+QQJAwABACwAAAAAJAAkAAACaIyPqcvtD6OctNqLs968ew98C0CGolGWZ5CSa2tasQJf6djKeVJXPfKbBFE7ypBV5DWOR6SLliTeeFGnijoFVpnbbvbA/UqvWrH1WSaDveoxem0Ot88zd50OjbPf9vzcucRXtkJYiFEAACH5BAkDAAEALAAAAAAkACQAAAJmjI+py+0Po5y02ouz3rz7D4biApQAY55XqiasxbZHDL+uTdF3WvO72QP+SkHiUCbRIZRL4VHBnPmaU2nVEA1ktzir02ukfrFd8lVbRp+56zR7rIa/w2BknG6Wu/dndQNuNSI4WFEAACH5BAkDAAEALAAAAAAkACQAAAJnjI+py+0Po5y02ouz3rx7CXwLQIaiUZZnkJJra4owE1uzkl43sk892rIFE79IsYhqHIdEFY55WOaaUx4UWI1eWVup05rFfrVhbtnroo7FafDa/EbX2HN4mxzv6s/7t1l5R7UySIhRAAAh+QQJAwABACwAAAAAJAAkAAACZ4yPqcvtD6OctNqLs94W8AaE3peIIomYIXqoI+uyRizTsCoHtvJWe3vq4EpDXi9VBJoWS2MT+VQGoVPpihidJbVZ3dbb/YGrXPL4SkVbj2e2+P2Fh+P0ud0sx9f1d7US5AeVM0iIUQAAIfkECQMAAQAsAAAAACQAJAAAAmeMj6nL7Q+jnLTai7M+oIPNeB6oiB2ZmB/KmWwrvoYqB7R8vzm7V2vpssSAQ2AoiOjNRkRmEglzRk8p6LI4/WWb1Cf2KgV3t9WvzXo2K9dotroNf8vDabrbHsfPx2ItrEH3VzNIeFEAACH5BAkDAAEALAAAAAAkACQAAAJmjI+py+0Po5y0WgnuBDxr13VfE3IjU3pnkq5K6yJwbMy0HeMbWV7hooPogo9hr2L8AXlK2ZElej0PyaizSZ3WtIGqCYrdhrtcryo7NkvT5Tb7bUXHxXMy/Hutq8F6rp0JSCM4KFgAACH5BAkDAAEALAAAAAAkACQAAAJsjI+py+0Po5y02ggyuFhv3ngZGIokI35nkq5K6yJwbMyUt9iTyfK3f9B1cD3izxgESoRCCFM51LygAWTSWqVCn1iutPiVbcddcvh6rplHYLa4DE9n4250XU1X2fV4ufc+56cFeFXCR4OYuFIAACH5BAkDAAEALAAAAAAkACQAAAJtjI+py+0Po5y0WgnuBDxr13VfE3IjU3pnkmqq0lrhElP1cWMlvFd58IP8go9hz3bEJXUz1jJibMJIz6AUERU5r4asaavFVsdcIDmsLHtf3fNXrHazzfE6um1/p+90/pqXN2elt0U1t4KYqJhQAAAh+QQJAwABACwAAAAAJAAkAAACcIyPqcvtD6OctNqLsz6gg814XvYtYneJ5mmdJeK2bBJXNTxTN5dPu/GLBIOQYU9iVNmOAWLzRWMSlVEqzwqUarFPbnJUBeO8W/HVnCWr0V32FxWGj91l+dmepq/xbf4bmudXB9hH2NXAdgWyyNj4UAAAIfkECQMAAQAsAAAAACQAJAAAAnCMj6nL7Q+jnLTai7PeCHjggNf3LeRIil1qperhtmwSV/V62jNe6jnvkf1gu8mNOKQxjgZms0crPpMBp1VaxV6pWyjSOwVnudoy+SzuBqPoNfAVdn/lcfg4bca37Wp+nn4H2KcwSAiI1CDGscjYmFAAACH5BAkDAAEALAAAAAAkACQAAAJyjI+py+0Po5y02nsBlqDr3XgeyIgduZifslpqOromO1dvclP5sXM10uOFfjxi8UQTJWNAYyAIdUaVOKmV2sQemVtklmuYgp/XsdjbbYXL6LXWbWaryW96vH6e55dte39fhSfHpzcYOEY3NHeE0uj4+FAAACH5BAkDAAEALAAAAAAkACQAAAJyjI+py+0Po5y02muBBhhu3TUfGC4jVypnqo5ssr5HDG/MZ7qtvZMIPdP9hEFczThEFnlJ5tL3RDWhBmCVeFVmnVtqwPrFhrVjbtkLTovVZLbZjV7L2/N3PU7P2/X4vb8PKBXVE0go2HWYJeJVJOP4+FgAACH5BAkDAAEALAAAAAAkACQAAAJyjI+py+0Po5y02nsBlqDr3XgeyIgduZiftSpqNromOydvdSP5tBv90bLVdEPiSSZCxoxLYNH3DPymUWpSeGUetUFp9Zt1hqFjb9naJKfNa/RW3AbHz/K32s7Gu7t7pb7OB+gXSFc4t2YWgieG0uj4+FAAACH5BAkDAAEALAAAAAAkACQAAAJxjI+py+0Po5y02ouz3gh4oIHL913kSIpUqh6s9SbxmirzdBt5tO9QX6sAT4xWJ3gkyko2pMupgwaGzGT1qcReo1nudiqleppdcFlsNH/R5HX4fYa74/S5fbys4617bd/7pxbIlneXZtbwhcXB2Oj4UAAAIfkECQMAAQAsAAAAACQAJAAAAm+Mj6nL7Q+jnLTai7OeoIPNeF7zXWK3iOapnCXltmwVJzU8IzeXH7v0CwQhweGj2AMmhUsDKrUcqmRTXfRa9WFHtu3TmnV6X9ow04xEj6lccLv8Fqvn8XM9fV936V94X57HRwb4J0dSWAaiuMj4UAAAIfkEBQMAAQAsAAAAACQAJAAAAnGMj6nL7Q+jnLTauwCWoOvdeB7IiB2ZmahifuzWpqcVJzV1Hzmn2j3+0wV5ItYwsgskIcnlo3k0uIxFX9U6FV61I+wMAd1Kj+EumIwWK9Nm7tedXavL7/GcXZe37Xt9nh4HSNUn6BUnF5KntcLY6LhQAAA7"
								alt="live" data-v-0d1a0946=""> 直播中 </div>
					</div>
				</a>
				<div class="user-content p_relative" data-v-6182da82=""><!---->
					<h2 class="b_text i_card_title mt_0" data-v-6182da82="">
						<a class="user-name cs_pointer v_align_middle"
							href="//space.bilibili.com/${mid}" target="_blank" data-v-6182da82="">
							${name}
							<svg class="level-icon ml_sm" data-v-fec65f0c="" data-v-6182da82="">
								<use xlink:href="#lv_6"></use>
							</svg>
						</a>
						<div class="user-actions d_inline_block ml_md" data-v-6182da82="">
							<button class="vui_button vui_button--blue" data-v-6182da82=""> + 关注 </button>
						</div>
					</h2>
					<p class="b_text text2 text_ellipsis mt_sm" data-v-6182da82="">
						<!--粉丝：20.0万 · 视频：1341-->
						${title}
						<span class="text3 ml_md" data-v-6182da82="">${sign}</span>
					</p>
				</div>
			</div>
		</div><!---->
	</div>
</div>
`
}