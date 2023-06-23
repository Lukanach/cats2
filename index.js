const $wr = document.querySelector('[data-wr]')
const $wrDet = document.querySelector('[data-wrDet]')
// const $wr3 = document.querySelector('[data-wr3]')

const $modalWr = document.querySelector('[data-modalWr]')
const $modalWrDet = document.querySelector('[data-modalWrDet]')
// const $modalWr3 = document.querySelector('[data-modalWr3]')

const $modalContent = document.querySelector('[data-modalContent]')
const $modalContentDet = document.querySelector('[data-modalContentDet]')
const CREATE_FORM_LS_KEY = 'CREATE_FORM_LS_KEY'

const ACTIONS = {
  DETAIL: 'detail',
  DELETE: 'delete',
}

const getCreateCatFormHTML = () => `
  <h3 class="text-center mb-3">Create new cat</h3>
  <form name="createCatForm">
    <div class="mb-3">
      <input type="number" name="id" required placeholder="Id" class="form-control">
    </div>
    <div class="mb-3">
      <input type="text" name="name" required placeholder="Name" class="form-control">
    </div>
    <div class="mb-3">
      <input type="number" name="age" placeholder="Age" class="form-control">
    </div>
    <div class="mb-3">
      <input type="text" name="description" placeholder="Description" class="form-control">
    </div>
    <div class="mb-3">
      <input type="text" name="image" placeholder="Image url" class="form-control">
    </div>
    <div class="mb-3 form-check">
      <input type="checkbox" name="favourite" class="form-check-input" id="exampleCheck1">
      <label class="form-check-label" for="exampleCheck1">Favourite</label>
    </div>
    <div class="mb-3">
      <input type="range" name="rate" min="1" max="10">
    </div>
    <button type="submit" class="btn btn-primary">Submit</button>
  </form>`

const getCatHTML = (cat) => `
		<div data-cat-id="${cat.id}" class="card mb-4 mx-2" style="width: 18rem">
		<img src="${cat.image}" class="card-img-top" alt="${cat.name}" />
		<div class="card-body">
			<h5 class="card-title">${cat.name}</h5> 
			<p class="card-text">
				${cat.description}
			</p>
			<button data-action="${ACTIONS.DETAIL}" data-openModal="AboutCat" type="button" class="btn btn-primary">Detail</button>
			<button data-action="${ACTIONS.DELETE}"  type="button" class="btn btn-danger">Delete</button>
		</div>
	</div>
	`

fetch('https://cats.petiteweb.dev/api/single/Lukanach/show/')
  .then((res) => res.json())
  .then((data) => {
    $wr.insertAdjacentHTML(
      'afterbegin',
      data.map((cat) => getCatHTML(cat)).join(''),
    )

    console.log({ data })
  })

$wr.addEventListener('click', (e) => {
  if (e.target.dataset.action === ACTIONS.DELETE) {
    console.log(e.target)

    const $catWr = e.target.closest('[data-cat-id')
    const catId = $catWr.dataset.catId

    console.log({ catId })

    fetch(`https://cats.petiteweb.dev/api/single/Lukanach/delete/${catId}`, {
      method: 'DELETE',
    }).then((res) => {
      if (res.status === 200) {
        return $catWr.remove()
      }

      alert(`Удаление кота с id = ${catId} не удалось`)
    })
  }
})

const formatCreateFormData = (formDataObject) => ({
  ...formDataObject,
  id: +formDataObject.id,
  rate: +formDataObject.rate,
  age: +formDataObject.rate,
  favourite: !!formDataObject.favourite,
})

const clickModalWrHandler = (e) => {
  console.log(e)
  if (e.target === $modalWr) {
    $modalWr.classList.add('hidden')
    $modalWr.removeEventListener('click', clickModalWrHandler)
    $modalContent.innerHTML = ''
  }
}

const submitCreateCatHandler = (e) => {
  e.preventDefault()

  let formDataObject = formatCreateFormData(Object.fromEntries(new FormData(e.target).entries()))

  formDataObject = fetch('https://cats.petiteweb.dev/api/single/Lukanach/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formDataObject),
  }).then((res) => {
    if (res.status === 200) {
      $modalWr.classList.add('hidden')
      $modalWr.removeEventListener('click', clickModalWrHandler)
      $modalContent.innerHTML = ''
      localStorage.removeItem(CREATE_FORM_LS_KEY)
      return $wr.insertAdjacentHTML(
        'afterbegin',
        getCatHTML(formDataObject),
      )
    }
    throw Error('Cat creation error')
  }).catch(alert)
}

const openModalHandler = (e) => {
  const targetModalName = e.target.dataset.openmodal

  if (targetModalName === 'createCat') {
    $modalWr.classList.remove('hidden')
    $modalWr.addEventListener('click', clickModalWrHandler)

    $modalContent.insertAdjacentHTML('afterbegin', getCreateCatFormHTML())
    const $createCatForm = document.forms.createCatForm

    const dataFromLS = localStorage.getItem(CREATE_FORM_LS_KEY)

    const preparedDataFromLS = dataFromLS && JSON.parse(dataFromLS)

    console.log({ preparedDataFromLS })

    if (preparedDataFromLS) {
      Object.keys(preparedDataFromLS).forEach((key) => {
        $createCatForm[key].value = preparedDataFromLS[key]
      })
    }
    $createCatForm.addEventListener('submit', submitCreateCatHandler)
    $createCatForm.addEventListener('change', (changeEvent) => {
      const formattedData = formatCreateFormData(
        Object.fromEntries(new FormData($createCatForm).entries()),
      )
      localStorage.setItem(CREATE_FORM_LS_KEY, JSON.stringify(formattedData))
      console.log({ formattedData })
    })
  }
}

document.addEventListener('click', openModalHandler)

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    $modalWr.classList.add('hidden')
    $modalWr.removeEventListener('click', clickModalWrHandler)
    $modalContent.innerHTML = ''
  }
})

// Детальная страница

const formatInfoFormData = (formDataObject) => ({
  ...formDataObject,
  id: +formDataObject.id,
  rate: +formDataObject.rate,
  age: +formDataObject.age,
  favorite: !!formDataObject.favorite,
})

const clickModalWrHandler2 = (e) => {
  if (e.target === $modalWrDet) {
    $modalWrDet.classList.add('hidden')
    $modalWrDet.removeEventListener('click', clickModalWrHandler2)
    $modalContentDet.innerHTML = ''
  }
}

const openModalHandler2 = (e) => {
  const targetModalName = e.target.dataset.openmodal

  if (targetModalName === 'AboutCat') {
    $modalWrDet.classList.remove('hidden')
    $modalWrDet.addEventListener('click', clickModalWrHandler2)

    const getCatHTMLInfo = (cat) => {
      const $catWr = e.target.closest('[data-cat-id]')
      const catId = $catWr.dataset.catId

      if (cat.id == catId) {
        return `
          <div data-cat-id="${cat.id}" class="card card__info">
              <img src="${cat.image}" class="card__img" alt="${cat.name}">
              <div class="card__body">
                  <h5 class="card__title">${cat.name}</h5>
                  <p class="card__text">${cat.description}</p>
                  <p class="card__text">Возраст:&nbsp${cat.age}</p>
                  <p class="card__text">Рейтинг:&nbsp${cat.rate}</p>
                  <p class="card__text">Любимчик:&nbsp${cat.favorite}</p>
              </div>
          </div>
      `
      }
    }

    fetch('https://cats.petiteweb.dev/api/single/Lukanach/show/')
      .then((res) => res.json())
      .then((data) => {
        $wrDet.insertAdjacentHTML('afterbegin', data.map((cat) => getCatHTMLInfo(cat)).join(''))
      })
  }
}

document.addEventListener('click', openModalHandler2)

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    $modalWrDet.classList.add('hidden')
    $modalWrDet.removeEventListener('click', clickModalWrHandler2)
    $modalContentDet.innerHTML = ''
  }
})
