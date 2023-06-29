document.addEventListener('DOMContentLoaded', function() {
  var coll = document.getElementsByClassName("collapsible");
  var i;

  for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
      var alreadyOpen = this.nextElementSibling.style.display === "block";

      // Collapse all sections
      for (var j = 0; j < coll.length; j++) {
        coll[j].nextElementSibling.style.display = "none";
      }

      // If the clicked section was not already open, expand it
      if (!alreadyOpen) {
        this.nextElementSibling.style.display = "block";
      }
    });
  }
});
