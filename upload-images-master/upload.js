function bytesToSize(bytes) {//размер файла 
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (!bytes) {
    return '0 Byte'
  }
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
  return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i]
}

const element = (tag, classes = [], content) => {
  const node = document.createElement(tag)

  if (classes.length) {
    node.classList.add(...classes)
  }

  if (content) {
    node.textContent = content
  }

  return node
}

function noop() {}

export function upload(selector, options = {}) {
  let files = []
  const onUpload = options.onUpload ?? noop
  const input = document.querySelector(selector)
  const preview = element('div', ['preview'])
  const open = element('button', ['btn'], 'Открыть')
  const upload = element('button', ['btn', 'primary'], 'Загрузить')
  upload.style.display = 'none'

  if (options.multi) {
    input.setAttribute('multiple', true)
  }

  if (options.accept && Array.isArray(options.accept)) {//являебся ли массивом какой-либо обьект
    input.setAttribute('accept', options.accept.join(','))
  }

  input.insertAdjacentElement('afterend', preview)
  input.insertAdjacentElement('afterend', upload)
  input.insertAdjacentElement('afterend', open)

  const triggerInput = () => input.click()

  const changeHandler = event => {//список файлов, далее проверка если нет никаких файлов
    if (!event.target.files.length) {
      return
    }

    files = Array.from(event.target.files)//являеться ли массиовом 
    preview.innerHTML = ''
    upload.style.display = 'inline'

    files.forEach(file => {//файл будет являться массивом 
      if (!file.type.match('image')) {//если файле есть image
        return
      }

      const reader = new FileReader()//вывести превью фото

      reader.onload = ev => {//обработчик события  
        const src = ev.target.result
        preview.insertAdjacentHTML('afterbegin', `
          <div class="preview-image">
            <div class="preview-remove" data-name="${file.name}">&times;</div>
            <img src="${src}" alt="${file.name}" />
            <div class="preview-info">
              <span>${file.name}</span>
              ${bytesToSize(file.size)}
            </div>
          </div>
        `)
      }

      reader.readAsDataURL(file)//МЕТОД куда передаем сам файл
    })
  }

  const removeHandler = event => {//Обработка закрытия файла
    if (!event.target.dataset.name) { 
      return
    }

    const {name} = event.target.dataset
    files = files.filter(file => file.name !== name) //удаление из массива 

    if (!files.length) {
      upload.style.display = 'none'
    }

    const block = preview// удаление из блока 
      .querySelector(`[data-name="${name}"]`)
      .closest('.preview-image')

    block.classList.add('removing')
    setTimeout(() => block.remove(), 300) //удаление через 300 сек с аимацией 
  }

  const clearPreview = el => {
    el.style.bottom = '4px'
    el.innerHTML = '<div class="preview-info-progress"></div>'
  }

  const uploadHandler = () => {
    preview.querySelectorAll('.preview-remove').forEach(e => e.remove())
    const previewInfo = preview.querySelectorAll('.preview-info')
    previewInfo.forEach(clearPreview)
    onUpload(files, previewInfo)
  }

  open.addEventListener('click', triggerInput)
  input.addEventListener('change', changeHandler)
  preview.addEventListener('click', removeHandler)
  upload.addEventListener('click', uploadHandler)
}