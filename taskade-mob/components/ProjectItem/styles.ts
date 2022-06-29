import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  innerContainer: {
    flexDirection: 'row',
    width: '100%',
    padding: 10,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#404040',
    marginRight: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    fontSize: 20,
    marginRight: 5,
  },
  time: {
    color: 'darkgrey',
  },
})

export default styles