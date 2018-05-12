import React from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { connect } from 'react-redux'
import {injectIntl, IntlProvider, FormattedMessage, addLocaleData} from 'react-intl';
import fetch from './cross-fetch-with-timeout';
import CustomUtils from './custom-utils'
import { formatMessage as f } from './custom-utils'

class SelectBoxFieldActive extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      schema  : this.props.schema,
      field : this.props.field,
      value : this.props.field.active,
      dropdownOpen: false,
      locale : null
    };
  }

  toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  handleChange = (selectedOption) => {
    this.setState(selectedOption);
    console.log(`Selected: ${selectedOption.value}, ${selectedOption.label}`);

    this.props.dispatch({
			type: "REQUEST_FIELD_EDIT",
      payload:{ category: this.props.vo.schema.category, col:"active", name: this.state.field.name, value: selectedOption.value }
    });
    
  }

  
  render() {
    return (
      <div>
      <Select
          name={this.state.field.name + '_active'}
          clearable={false}
          searchable={false}
					value={this.state.value}
					onChange={this.handleChange}
          options={[
            { value: '0', label: f("schema_view.use_select.select","text-light") },
            { value: '1', label: f("schema_view.use_select.recommend") },
            { value: '2', label: f("schema_view.use_select.required","text-primary") },
          ]}
				/>
        </div>
    );
  }
}


const mapStateToProps = state => {
	return {
    vo: state.schemaVo
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch : dispatch,
    onTodoClick: id => {
      dispatch()
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  {pure:false}
)(SelectBoxFieldActive);
