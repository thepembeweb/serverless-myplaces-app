import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import {
  createPlace,
  deletePlace,
  getPlaces,
  patchPlace
} from '../api/places-api'
import Auth from '../auth/Auth'
import { Place } from '../types/Place'

interface PlacesProps {
  auth: Auth
  history: History
}

interface PlacesState {
  places: Place[]
  newPlaceName: string
  loadingPlaces: boolean
}

export class Places extends React.PureComponent<PlacesProps, PlacesState> {
  state: PlacesState = {
    places: [],
    newPlaceName: '',
    loadingPlaces: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newPlaceName: event.target.value })
  }

  onEditButtonClick = (placeId: string) => {
    this.props.history.push(`/places/${placeId}/edit`)
  }

  onPlaceCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const dueDate = this.calculateDueDate()
      const newPlace = await createPlace(this.props.auth.getIdToken(), {
        name: this.state.newPlaceName,
        dueDate
      })
      this.setState({
        places: [...this.state.places, newPlace],
        newPlaceName: ''
      })
    } catch {
      alert('Place creation failed')
    }
  }

  onPlaceDelete = async (placeId: string) => {
    try {
      await deletePlace(this.props.auth.getIdToken(), placeId)
      this.setState({
        places: this.state.places.filter(place => place.placeId != placeId)
      })
    } catch {
      alert('Place deletion failed')
    }
  }

  onPlaceCheck = async (pos: number) => {
    try {
      const place = this.state.places[pos]
      await patchPlace(this.props.auth.getIdToken(), place.placeId, {
        name: place.name,
        dueDate: place.dueDate,
        done: !place.done
      })
      this.setState({
        places: update(this.state.places, {
          [pos]: { done: { $set: !place.done } }
        })
      })
    } catch {
      alert('Place deletion failed')
    }
  }

  async componentDidMount () {
    try {
      const places = await getPlaces(this.props.auth.getIdToken())
      this.setState({
        places,
        loadingPlaces: false
      })
    } catch (e) {
      alert(`Failed to fetch places: ${e.message}`)
    }
  }

  render () {
    return (
      <div>
        <Header as='h1'>My Places</Header>

        {this.renderCreatePlaceInput()}

        {this.renderPlaces()}
      </div>
    )
  }

  renderCreatePlaceInput () {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New place',
              onClick: this.onPlaceCreate
            }}
            fluid
            actionPosition='left'
            placeholder='My new favourite place...'
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderPlaces () {
    if (this.state.loadingPlaces) {
      return this.renderLoading()
    }

    return this.renderPlacesList()
  }

  renderLoading () {
    return (
      <Grid.Row>
        <Loader indeterminate active inline='centered'>
          Loading Places
        </Loader>
      </Grid.Row>
    )
  }

  renderPlacesList () {
    return (
      <Grid padded>
        {!this.state.places && <div>Create some places</div>}
        {this.state.places.map((place, pos) => {
          return (
            <Grid.Row key={place.placeId}>
              <Grid.Column width={1} verticalAlign='middle'>
                <Checkbox
                  onChange={() => this.onPlaceCheck(pos)}
                  checked={place.done}
                />
              </Grid.Column>
              <Grid.Column width={10} verticalAlign='middle'>
                {place.name}
              </Grid.Column>
              <Grid.Column width={3} floated='right'>
                {place.dueDate}
              </Grid.Column>
              <Grid.Column width={1} floated='right'>
                <Button
                  icon
                  color='blue'
                  onClick={() => this.onEditButtonClick(place.placeId)}
                >
                  <Icon name='pencil' />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated='right'>
                <Button
                  icon
                  color='red'
                  onClick={() => this.onPlaceDelete(place.placeId)}
                >
                  <Icon name='delete' />
                </Button>
              </Grid.Column>
              {place.attachmentUrl && (
                <Image src={place.attachmentUrl} size='small' wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate (): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
