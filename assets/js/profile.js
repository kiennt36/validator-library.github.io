const profileElement = document.querySelector('#profile')

const provinces = PROVINCES.reduce((result, item) => {
	result[item.key] = item.value
	return result
}, {})

const favorites = FAVORITES.reduce((result, item) => {
	result[item.key] = item.value
	return result
}, {})

if(profileElement) {
	const dataUser = JSON.parse(localStorage.getItem('dataUser'))
	if(!dataUser) window.location = DOMAIN_NAME + 'index.html'
	
	const newFavorites = dataUser.favorite.reduce((list, value, index) => {
		list[index] = favorites[value]
		return list
	}, []).join(', ')
	
	const htmls = `
		<div class="profile-bg"></div>
		<div class="profile-main">
			<div class="profile-main__avatar" style="background-image: url('${dataUser.srcAvatar}')"></div>

			<div class="profile-main__title">
				<h3 class="profile-main__name">
					${dataUser.fullName}
				</h3>
			</div>

			<div class="profile-main__desc">
				<div class="col profile-main__desc-email">
					<span class="profile-main__desc-text">
						Email
					</span>
					<span class="profile-main__desc-value">
						${dataUser.email}
					</span>
				</div>
				<div class="col profile-main__desc-province">
					<span class="profile-main__desc-text">
						Tỉnh/Tp
					</span>
					<span class="profile-main__desc-value">
						${provinces[dataUser.province]}
					</span>
				</div>
				<div class="col profile-main__desc-gender">
					<span class="profile-main__desc-text">
						Giới tính
					</span>
					<span class="profile-main__desc-value">
						${GENDERS[dataUser.gender]}
					</span>
				</div>
				<div class="col profile-main__desc-favorite">
					<span class="profile-main__desc-text">
						Sở thích
					</span>
					<span class="profile-main__desc-value">
						${newFavorites}
					</span>
				</div>
				
			</div>
		</div>
	`

	profileElement.innerHTML = htmls
}
