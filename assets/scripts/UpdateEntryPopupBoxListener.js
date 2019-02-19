$('#modal').on('show.bs.modal', function(event) {
  const button = $(event.relatedTarget)
  const entryId = button.data('entryid')
  const firstItem = button.data('firstitem')
  const secondItem = button.data('seconditem')
  document.querySelector('#firstItem').setAttribute('placeholder', firstItem)
  document.querySelector('#secondItem').setAttribute('placeholder', secondItem)
  document
    .querySelector('#update-form')
    .setAttribute(
      'action',
      `/user/${entryId}?username=<%= username %>&_method=PUT`
    )
})
