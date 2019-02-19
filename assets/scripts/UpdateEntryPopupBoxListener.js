$('#update-entry-form-box').on('show.bs.modal', function(event) {
  const button = $(event.relatedTarget)
  const entryId = button.data('entryid')
  const firstItem = button.data('firstitem')
  const secondItem = button.data('seconditem')
  const username = button.data('username')
  document
    .querySelector('#firstItem-change')
    .setAttribute('placeholder', firstItem)
  document
    .querySelector('#secondItem-change')
    .setAttribute('placeholder', secondItem)
  document
    .querySelector('#update-form')
    .setAttribute(
      'action',
      `/user/${entryId}?username=${username}&firstitem=${firstItem}&seconditem=${secondItem}&_method=PUT`
    )
})
