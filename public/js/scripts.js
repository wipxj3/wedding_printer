var PictureList = React.createClass({
	getInitialState: function (){
		return {
			pictures: [],
			loading: false,
			searchQuery: '',
			showProfilePage: false,
		}
	},

	componentDidMount: function () {
		this.refresh();
	},

	componentDidUpdated: function () {
		this.refresh();
	},

	getSearchResults: function (url) {
		var self = this;

		$.getJSON(url, function (result) {
			if ( !result || !result.data || !result.data.length ) {
				console.log('no data');
				return false;
			};

			var pictures = result.data.map(function (pic) {
				return {
					id: pic.id,
					name: pic.full_name,
					src: pic.profile_picture
				}
			});
			self.setState({pictures: pictures, loading: false})
		});
	},

	handleSearch: function () {
		this.setState({
			searchQuery: this.refs.search.value,
			showProfilePage: false,
		});

		this.refresh();
	},

	refresh: function () {
		var urlUsers = 'https://api.instagram.com/v1/users/search?q=' + this.state.searchQuery + '&client_id=' + this.props.apiKey + '&callback=?';
		// var urlHash = 'https://api.instagram.com/v1/tags/search?q='+ this.state.searchQuery +'&client_id=' + this.props.apiKey + '&callback=?';

		this.setState({pictures: [], loading: true});

		// this.getSearchResults( urlHash );
		this.getSearchResults( urlUsers );
	},

	showProfile: function () {
		var latestMediaUrl = 'https://api.instagram.com/v1/users/'+ arguments[0].id +'/media/recent/?client_id=' + this.props.apiKey + '&callback=?';

		var self = this;

		$.getJSON( latestMediaUrl, function (result) {
			console.log(result);
			if ( !result || !result.data || !result.data.length ) {
				return false;
			};

			self.setState({ showProfilePage: result });
		});
	},

	render: function () {
		var that = this;
		if (this.state.showProfilePage) {
			return (
				<div className="container">
					<div className="formBox">
						<input type="text" required="required" ref="search" value={this.state.query} onChange={this.handleSearch} placeholder="" />
						<label>Enter Instagram Username</label>
					</div>
					<ProfilePage userProfile={ this.state.showProfilePage } />
				</div>
			)
		}else {
			return (
				<div className="container">
					<div className="formBox">
						<input type="text" required="required" ref="search" value={this.state.query} onChange={this.handleSearch} placeholder="" />
						<label>Enter Instagram Username</label>
					</div>
					<div ref="list" className="images-list">
						{
							this.state.pictures.map( function( usr ) {
								return <div className="item" key={ usr.id }>
										<img onClick={ function () { that.showProfile( usr ) } } src={ usr.src } />
										<h3 onClick={ function () { that.showProfile( usr ) } }>{ usr.name }</h3>
									</div>
							})
						}
					</div>
				</div>
			)
		}
	}
});


var ProfilePage = React.createClass({
	getInitialState: function () {
		return {
			imageList: this.props.userProfile
		}
	},
	render: function () {
		return (
			<div className="profilePage">
				{
					this.state.imageList.data.map( function ( img ) {
						var date = new Date(img.created_time * 1000);
						var dd = date.getDate();
						var mm = date.getMonth() + 1;
						var yyyy = date.getFullYear();

						dd = dd < 10 ? 0 + dd : dd;
						mm = mm < 10 ? 0 + mm : mm;

						date = dd + '/' + mm + '/' + yyyy;

						return <div className="item" key={ img.id } >
								<a target="blank_" href={ img.images.standard_resolution.url }>
								<img src={ img.images.standard_resolution.url } />
								</a>
								<span className="time">{ date }</span>
								<h3 className="hashtags">
									{ img.caption ? img.caption.text : ''}
								</h3>
							</div>
					})
				}
			</div>
		)
	}
});


ReactDOM.render(
	<PictureList apiKey="5a23f3df5c434b8d9a3dba685ed116e0" searchString="" />,
	document.getElementById('content')
);