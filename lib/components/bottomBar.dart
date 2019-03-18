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
          icon: Icon(Icons.spa, color: cores[0]),
          title: Text(_titulos[0],
              style: TextStyle(color: cores[0], fontWeight: FontWeight.bold)),
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.cloud, color: cores[1]),
          title: Text(_titulos[1],
              style: TextStyle(color: cores[1], fontWeight: FontWeight.bold)),
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.grain, color: cores[2]),
          title: Text(_titulos[2],
              style: TextStyle(color: cores[2], fontWeight: FontWeight.bold)),
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.wb_sunny, color: cores[3]),
          title: Text(_titulos[3],
              style: TextStyle(color: cores[3], fontWeight: FontWeight.bold)),
        ),
      ],
    );
  }
}
