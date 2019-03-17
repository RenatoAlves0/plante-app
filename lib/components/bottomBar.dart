import 'package:flutter/material.dart';

class BottomBar extends StatefulWidget {
  final int propsItemSelected;
  const BottomBar({Key key, this.propsItemSelected}) : super(key: key);

  @override
  _BottomBarState createState() => _BottomBarState();
}

class _BottomBarState extends State<BottomBar> {
  List<Color> cores = [
    Colors.green[700],
    Colors.blue[700],
    Colors.brown[700],
    Colors.amber[700]
  ];
  List<String> _titulos = ["Planta", "Clima", "Solo", "Luz"];
  int itemSelected;
  bool receivedProps = true;

  void changeItemSelected(int index) {
    setState(() {
      itemSelected = index;
    });
  }

  void init(int propsItemSelected) {
    if (receivedProps) {
      setState(() {
        changeItemSelected(propsItemSelected);
        receivedProps = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    init(widget.propsItemSelected);
    return builBottomBar();
  }

  Widget builBottomBar() {
    return BottomNavigationBar(
      onTap: (index) => changeItemSelected(index),
      currentIndex: itemSelected,
      items: [
        BottomNavigationBarItem(
          icon: Icon(Icons.spa),
          title: Text(_titulos[0]),
          backgroundColor: cores[0],
        ),
        BottomNavigationBarItem(
            icon: Icon(Icons.cloud_queue),
            title: Text(_titulos[1]),
            backgroundColor: cores[1]),
        BottomNavigationBarItem(
            icon: Icon(Icons.grain),
            title: Text(_titulos[2]),
            backgroundColor: cores[2]),
        BottomNavigationBarItem(
            icon: Icon(Icons.wb_sunny),
            title: Text(_titulos[3]),
            backgroundColor: cores[3]),
      ],
    );
  }
}
