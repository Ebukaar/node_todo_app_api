// This part of the code handles the show and hide logic for the edit and save buttons
$(document).ready(function(){
    $('.edit-btn').click(function(e){
        e.preventDefault();
        $(this).hide();
        $(this).siblings('.delete-btn').hide();
        $(this).siblings('.save-btn').show();
        $(this).closest('li').find('.todo-content').hide();
        $(this).closest('li').find('.edit-input').show();
    });

    $('.save-btn').click(function(e){
        e.preventDefault();
        var id = $(this).data('id');
        var updatedContent = $(this).closest('li').find('.edit-input').val();
        
        // Ajax request to update the to-do
        $.post('/update/todo/' + id, { todo: updatedContent }, function(data) {
            if (data.success) {
                location.reload(); // reload the page to show updated data
            }
        });
    });
});
