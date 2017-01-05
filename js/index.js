$(function () {
	$.getJSON("json/20170102MOS.json", function(result) {
		var show_filter = 'all';

		function showFilter() {
			var show_filter_text = '';

			switch(show_filter)
			{
				case 'all':
				case 'checked':
				case 'unchecked':
					show_filter_text = $('.dropdown-item[data-filter="' + show_filter + '"]').text();
					break;

				default:
					break;
			}

			if ('all' == show_filter) {
				$('.list-group.checked-list-box .list-group-item').show();
			} else {
				$('.list-group.checked-list-box .list-group-item').hide();
				$('.list-group.checked-list-box .list-group-item').each(function (i, item) {
					if (show_filter == $(this).data('filter')) {
						$(this).show();
					}
				});
			}

			$('#show_filter').html(show_filter_text);
		}

		$.each(result, function(i, data) {
			var menu_string =
				'<div class="card"><div class="card-header">' + data.display_type +
				'</div><ul id="check-list-box" class="list-group list-group-flush checked-list-box">';
			$.each(data.menu, function(i, menu) {
				menu_string += '<li class="list-group-item" data-price="' + menu.price + '" data-type="' + data.type + '"><div class="row"><div class="col-xs-2">$' + menu.price + '</div><div class="col-xs-10">' + menu.name + '</div></div></li>';
			});
			menu_string += '</ul></div>';
			$('#menu_list').append(menu_string);
		});

		$('.list-group.checked-list-box .list-group-item').each(function () {
			// Settings
			var $widget = $(this),
			$checkbox = $('<input type="checkbox" hidden />'),
			color = ($widget.data('color') ? $widget.data('color') : "primary"),
			style = ($widget.data('style') == "button" ? "btn-" : "list-group-item-"),
			settings = {
				on: {
					icon: 'fa fa-check'
				},
				off: {
					icon: ''
				}
			};

			$widget.css('cursor', 'pointer')
			$widget.append($checkbox);

			// Event Handlers
			$widget.on('click', function () {
				if (!$(this).hasClass('is-disabled')) {
					$checkbox.prop('checked', !$checkbox.is(':checked'));
					$checkbox.triggerHandler('change');
					updateCheckbox();
				}
			});
			$checkbox.on('change', function () {
				if (!$(this).hasClass('is-disabled')) {
					updateCheckbox();
				}
			});

			// Actions
			function updateCheckbox() {
				var total_price = 0;
				$('#check-list-box li.is-active').each(function(i, item) {
					total_price += ($(item).data("price"));
				});
				$('#total_price span').html(150 - total_price);

				var isChecked = $checkbox.is(":checked");

				// Set the button"s state
				$widget.data("state", (isChecked) ? "on" : "off");

				// Set the button"s icon
				$widget.children().children(".col-xs-2").find(".state-icon")
				.removeClass()
				.addClass("state-icon " + settings[$widget.data("state")].icon);

				// Update the button"s color
				if (isChecked) {
					$widget.addClass(style + color + " is-active");
					$widget.data('filter', 'checked');
				} else {
					$widget.removeClass(style + color + " is-active");
					$widget.data('filter', 'unchecked');
				}

				showFilter();

				// validate by rules
				if (150 < total_price) {
					$('#toolbar').addClass('is-invalid');
				} else {
					$('#toolbar').removeClass('is-invalid');
				}
				$('.list-group.checked-list-box .list-group-item').removeClass('is-disabled');
				$('.list-group.checked-list-box .list-group-item.is-active').each(function () {
					$('.list-group.checked-list-box .list-group-item[data-type="' + $(this).data('type') + '"]').addClass('is-disabled');
				});
				$('.list-group.checked-list-box .list-group-item.is-active').removeClass('is-disabled');

				// check price sum
				$('.list-group.checked-list-box .list-group-item').each(function (i, item) {
					if ((150 - total_price) < $(this).data('price')) {
						$(this).addClass('is-invalid');
					} else {
						$(this).removeClass('is-invalid');
					}
				});
			}

			// Initialization
			function init() {
				if ($widget.data('checked') == true) {
					$checkbox.prop('checked', !$checkbox.is(':checked'));
				}

				updateCheckbox();

				// Inject the icon if applicable
				if ($widget.children().children('.col-xs-2').find('.state-icon').length == 0) {
					$widget.children().children('.col-xs-2').append(' <span class="state-icon ' + settings[$widget.data('state')].icon + '"></span>');
				}
			}
			init();
		});

		$('#reset').on('click', function() {
			$('.list-group.checked-list-box .list-group-item.is-active').each(function () {
				$(this).trigger('click');
			});
		});

		$('.dropdown-item').on('click', function() {
			show_filter = $(this).data('filter');
			showFilter();
		});
	});
});