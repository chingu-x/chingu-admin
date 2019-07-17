import React from 'react';
import { Query, ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';
import List from '@material-ui/core/List';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Divider from '@material-ui/core/Divider';
import Checkbox from '@material-ui/core/Checkbox';
import Avatar from '@material-ui/core/Avatar';
import { UserInfo } from '../fragments';
import DefaultUserImg from '../images/default_user_img.png';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '85vh',
    backgroundColor: '#fff'
  }
}));

export const GET_USERS = gql`
  ${UserInfo}

  query getUsers {
    users {
      ...UserInfo
    }
  }
`;

export function Container(props) {
  return (
    <Query query={GET_USERS}>
      {({ loading, error, data }) => {
        if (loading) return <p>"Loading..."</p>;
        if (error) return <p>{`Error: ${error}`}</p>;

        return <UserList {...props} users={data.users} />;
      }}
    </Query>
  );
}

export function Row(user, index, selectable, checked, handleToggle) {
  const labelId = `checkbox-list-secondary-label-${user.name}`;

  return (
    <ApolloConsumer key={index}>
      {client => {
        const cacheUser = client.readFragment({
          fragment: UserInfo,
          id: `User:${user.id}`
        });
        const fullUser = Object.assign({}, cacheUser, user);

        return (
          <React.Fragment>
            {index !== 0 && <Divider variant="middle" component="li" />}
            <ListItem
              button
              disableRipple
              onClick={() => selectable && handleToggle(fullUser)}
            >
              <ListItemAvatar>
                <Avatar
                  alt={`${fullUser.name}'s Avatar`}
                  src={fullUser.avatarURL || DefaultUserImg}
                />
              </ListItemAvatar>
              <ListItemText
                id={labelId}
                primary={fullUser.name}
                secondary={fullUser.email}
              />
              {selectable && (
                <ListItemSecondaryAction>
                  <Checkbox
                    edge="end"
                    onChange={() => handleToggle(fullUser)}
                    checked={
                      checked.findIndex(u => u.id === fullUser.id) !== -1
                    }
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                </ListItemSecondaryAction>
              )}
            </ListItem>
          </React.Fragment>
        );
      }}
    </ApolloConsumer>
  );
}

export default function UserList(props) {
  const {
    users = [],
    selectable = false,
    preChecked = [],
    handleCheck = () => {}
  } = props;
  const classes = useStyles();
  const [checked, setChecked] = React.useState(preChecked);

  const handleToggle = value => {
    const currentIndex = checked.findIndex(u => u.id === value.id);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
      handleCheck(value, 'ADDED', newChecked);
    } else {
      newChecked.splice(currentIndex, 1);
      handleCheck(value, 'REMOVED', newChecked);
    }

    setChecked(newChecked);
  };

  return (
    <List dense className={classes.root}>
      {users.map((user, index) =>
        Row(user, index, selectable, checked, handleToggle)
      )}
    </List>
  );
}
