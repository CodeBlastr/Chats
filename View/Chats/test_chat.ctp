<div>
	test chat Page
</div>

<script>
	(function($) {
		$(document).ready(function() {
			var request = $.ajax({
  				url: "/chats/chats/view",
  				type: "POST",
  				dataType: "json",
  				success: function(data) {
  					$.ajax({
  						url: "/chats/chats/view",
  						type: "POST",
  						data: data,
  						dataType: "html",
  						success: function(html) {
  								$('body').append(html);
  							}
  							
  						})
  					}	
  				});
			});
	})(jQuery);
</script>