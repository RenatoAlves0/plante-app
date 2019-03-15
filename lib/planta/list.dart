import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:path_provider/path_provider.dart';

class Planta extends StatefulWidget {
  @override
  _PlantaState createState() => _PlantaState();
}

class _PlantaState extends State<Planta> {
  final _color = Colors.green;

  final _especieController = TextEditingController();
  final _generoController = TextEditingController();
  final _familiaController = TextEditingController();
  final _apelidoController = TextEditingController();

  List plantaList = [];

  Map<String, dynamic> _lastRemoved;
  int _lastRemovedPos;

  @override
  void initState() {
    super.initState();
    readPlanta().then((data) {
      setState(() {
        plantaList = json.decode(data);
      });
    });
  }

  void addPlanta() {
    setState(() {
      Map<String, dynamic> newPlanta = Map();
      newPlanta["especie"] = _especieController.text;
      newPlanta["genero"] = _generoController.text;
      newPlanta["familia"] = _familiaController.text;
      newPlanta["nomePopular"] = _apelidoController.text;
      _especieController.text = "";
      _generoController.text = "";
      _familiaController.text = "";
      _apelidoController.text = "";
      plantaList.add(newPlanta);
      savePlanta();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: <Widget>[
          Divider(
            color: Colors.transparent,
          ),
          buildTextField("Família", _familiaController),
          Divider(
            color: Colors.transparent,
          ),
          buildTextField("Gênero", _generoController),
          Divider(
            color: Colors.transparent,
          ),
          buildTextField("Espécie", _especieController),
          Divider(
            color: Colors.transparent,
          ),
          buildTextField("Apelido", _apelidoController),
          ButtonBar(
            children: <Widget>[
              RaisedButton(
                color: _color,
                child: Text("Salvar", style: TextStyle(fontSize: 17)),
                textColor: Colors.white,
                onPressed: addPlanta,
              )
            ],
          ),
          Expanded(
            child: ListView.builder(
                padding: EdgeInsets.only(top: 10.0),
                itemCount: plantaList.length,
                itemBuilder: buildItem),
          )
        ],
      ),
    );
  }

  Widget buildTextField(String label, TextEditingController c) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 17),
      child: TextField(
        controller: c,
        decoration: InputDecoration(
            labelText: label,
            focusedBorder:
                OutlineInputBorder(borderSide: BorderSide(color: _color)),
            enabledBorder: const OutlineInputBorder(
              borderSide: const BorderSide(color: Colors.transparent),
            ),
            border: const OutlineInputBorder(),
            labelStyle: TextStyle(color: _color, fontSize: 20)),
      ),
    );
  }

  Widget buildItem(BuildContext context, int index) {
    return Dismissible(
      key: Key(DateTime.now().millisecondsSinceEpoch.toString()),
      background: Container(
        color: Colors.red,
        child: Align(
          alignment: Alignment(-0.9, 0.0),
          child: Icon(
            Icons.delete,
            color: Colors.white,
          ),
        ),
      ),
      direction: DismissDirection.startToEnd,
      child: ListTile(
        contentPadding: EdgeInsets.symmetric(horizontal: 30),
        title: Text(
          plantaList[index]["nomePopular"],
          style: TextStyle(fontSize: 20),
        ),
        subtitle: Text(
          plantaList[index]["familia"] +
              " " +
              plantaList[index]["genero"] +
              " " +
              plantaList[index]["especie"],
          style: TextStyle(fontSize: 15),
        ),
      ),
      onDismissed: (direction) {
        setState(() {
          _lastRemoved = Map.from(plantaList[index]);
          _lastRemovedPos = index;
          plantaList.removeAt(index);
          savePlanta();

          final snack = SnackBar(
            content: Text("Palnta \"${_lastRemoved["apelido"]}\" removida!"),
            action: SnackBarAction(
                label: "Desfazer",
                onPressed: () {
                  setState(() {
                    plantaList.insert(_lastRemovedPos, _lastRemoved);
                    savePlanta();
                  });
                }),
            duration: Duration(seconds: 2),
          );

          Scaffold.of(context).showSnackBar(snack);
        });
      },
    );
  }

  Future<File> _getFile() async {
    final directory = await getApplicationDocumentsDirectory();
    return File("${directory.path}/data.json");
  }

  Future<File> savePlanta() async {
    String data = json.encode(plantaList);

    final file = await _getFile();
    return file.writeAsString(data);
  }

  Future<String> readPlanta() async {
    try {
      final file = await _getFile();

      return file.readAsString();
    } catch (e) {
      return null;
    }
  }
}
