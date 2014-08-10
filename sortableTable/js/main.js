var Person = Backbone.Model.extend({

	defaults: {
		firstname: -1,
		lastname: '',
		age: '',      
		income: ''
	}

});
var Persons = Backbone.Collection.extend({

	model: Person,

	sortAttribute: "firstname",
	sortDirection: 1,

	sortPersons: function (attr) {
		this.sortAttribute = attr;
		this.sort();
	},

	comparator: function(a, b) {
		var a = a.get(this.sortAttribute),
		b = b.get(this.sortAttribute);

		if (a == b) return 0;

		if (this.sortDirection == 1) {
			return a > b ? 1 : -1;
		} else {
			return a < b ? 1 : -1;
		}
	}

});
var PersonTable = Backbone.View.extend({

	_personRowViews: [],	
	tagName: 'table',
	template: null,
	sortUpIcon: 'sign arrow up',
	sortDnIcon: 'sign arrow',
	attributes: {
		class: "table table-bordered table-striped"
	},

	events: {
		"click th": "headerClick"
	},
	initialize: function() {

		this.template = _.template( $('#person-table').html() );
		this.listenTo(this.collection, "sort", this.updateTable);
	},
	render: function() {

		this.$el.html(this.template());

      // Setup the sort indicators
      this.$('th div')
      .append($('<span>'))
      .closest('thead')
      .find('span')
      .addClass('sign icon-none')
      .end()
      .find('[column="'+this.collection.sortAttribute+'"] span')
      .removeClass('icon-none').addClass(this.sortUpIcon);

      this.updateTable();

      return this;
  },
  headerClick: function( e ) {
  	var $el = $(e.currentTarget),
  	ns = $el.attr('column'),
  	cs = this.collection.sortAttribute;

  	if (ns == cs) {
  		this.collection.sortDirection *= -1;
  	} else {
  		this.collection.sortDirection = 1;
  	}

  	$el.closest('thead').find('span').attr('class', 'sign icon-none');

  	if (this.collection.sortDirection == 1) {
  		$el.find('span').removeClass('icon-none').addClass(this.sortUpIcon);
  	} else {
  		$el.find('span').removeClass('icon-none').addClass(this.sortDnIcon);
  	}

  	this.collection.sortPersons(ns);
  },
  updateTable: function () {

  	var ref = this.collection,
  	$table;

  	_.invoke(this._personRowViews, 'remove');

  	$table = this.$('tbody');

  	this._personRowViews = this.collection.map(
  		function ( obj ) {
  			var v = new PersonRow({ model: ref.get(obj) });

  			$table.append(v.render().$el);

  			return v;
  		});
  }

});

var PersonRow = Backbone.View.extend({

	tagName: 'tr',

	template: null,

	initialize: function() {
		this.template = _.template( $('#person-row').html() );
	},

	render: function() {

		this.$el.html( this.template( this.model.toJSON()) );

		return this;
	}

});

$(function() {

	var personList = new Persons(personData);

	var personView = new PersonTable({ collection: personList });

	$('.block-table').html( personView.render().$el.attr('id', 'persons') );

});

