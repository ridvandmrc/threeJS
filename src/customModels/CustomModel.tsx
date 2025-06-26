import { CameraControls, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import * as THREE from "three";

interface IFurniture {
  columns: {
    col: THREE.MeshStandardMaterial;
    rows: THREE.MeshStandardMaterial[];
    rowTop: THREE.MeshStandardMaterial | null;
    rowTopPosition?: number;
    rowBottomPosition?: number;
    rowBottom: THREE.MeshStandardMaterial | null;
  }[];
  columnsCount: number;
  rowCount: number;
  height: number;
}

export const CustomModel = () => {
  const { scene } = useGLTF("./ikea_kallax_1x4.glb");
  const [furniture, setFurniture] = useState<IFurniture>({
    columns: [],
    columnsCount: 20,
    height: 43,
    rowCount: 25,
  });

  useEffect(() => {
    const col1 = cloneItem(scene.getObjectByName("Cube001_0"));
    const col2 = cloneItem(scene.getObjectByName("Cube002_0"));

    const rowTop = cloneItem(scene.getObjectByName("Cube003_0"));
    const rowBottom = cloneItem(scene.getObjectByName("Cube_0"));
    scene.traverse((child) => {
      if (child.type === "Mesh") {
        child.visible = false;
      }
    });

    setFurniture({
      ...furniture,
      columns: [
        {
          col: col1,
          rowTop: rowTop,
          rowBottom: rowBottom,
          rowTopPosition: rowTop.position.y,
          rowBottomPosition: rowBottom.position.y,
        },
        { col: col2 },
      ],
    });

    scene.add(col1, col2, rowTop, rowBottom);
  }, []);

  const onUpdateColumnCount = (count: number) => {
    const _count = +count.toFixed(0);
    if (_count < 2) return;
    const currentColumns = furniture.columns;

    if (currentColumns.length < _count) {
      const _newCol = cloneItem(currentColumns[0].col);
      const _cloneRowTop = cloneItem(currentColumns[0].rowTop);
      const _cloneRowBottom = cloneItem(currentColumns[0].rowBottom);

      _newCol.position.x += (_count - 1) * 0.35;
      _cloneRowTop.position.x += (_count - 2) * 0.36;
      _cloneRowBottom.position.x += (_count - 2) * 0.36;

      scene.add(_newCol);
      scene.add(_cloneRowTop);
      scene.add(_cloneRowBottom);
      setFurniture({
        ...furniture,
        columnsCount: _count * 10,
        columns: [
          ...currentColumns,
          {
            col: _newCol,
            rowTop: _cloneRowTop,
            rowTopPosition: _cloneRowTop.position.y,
            rowBottom: _cloneRowBottom,
            rowBottomPosition: _cloneRowBottom.position.y,
            rows: [],
          },
        ],
      });
    } else if (currentColumns.length > _count) {
      const _target = currentColumns[currentColumns.length - 1];

      scene.remove(_target.col, _target.rowTop, _target.rowBottom);
      setFurniture({
        ...furniture,
        columnsCount: _count * 10,
        columns: currentColumns.filter(
          (_, index) => index < currentColumns.length - 1
        ),
      });
    }
  };

  const onUpdateHeight = (height: number) => {
    if (height < 10) return;
    furniture.columns.forEach(
      ({ col, rowTop, rowBottom, rowTopPosition, rowBottomPosition }) => {
        col.scale.z = height / 50;

        rowTop?.position &&
          (rowTop.position.y = rowTopPosition + (height / 50 - 0.88) * 0.7);

        rowBottom?.position &&
          (rowBottom.position.y =
            rowBottomPosition - (height / 50 - 0.88) * 0.7);
      }
    );

    setFurniture({
      ...furniture,
      height: +height,
    });
  };

  const updateColor = (color: string) => {
    furniture.columns.forEach(({ col, rowTop, rowBottom }) => {
      col.material.color = new THREE.Color(color);
      rowTop?.material.color.set(color);
      rowBottom?.material.color.set(color);
    });
  };

  const onUpdateRowCount = (rowCount: number) => {
    console.log("rowCount", rowCount);
    if (rowCount < 1) return;
    const _currentRowCount = furniture.rowCount / 25;
    const _rowCount = +rowCount.toFixed(0);
    const _rowClone = [...furniture.columns];
    _rowClone.forEach((column) => {
      const rowTop = column.rowTop;

      if (rowCount > _currentRowCount && rowTop) {
        const newRow = cloneItem(rowTop);
        newRow.position.y -= _rowCount * 0.27;
        column.rows ? column.rows.push(newRow) : (column.rows = [newRow]);

        scene.add(newRow);
      } else if (rowCount < _currentRowCount) {
        console.log("column.rows", column.rows);
        scene.remove(column.rows?.pop());
      }
      setFurniture({
        ...furniture,
        columns: _rowClone,
        rowCount: rowCount * 25,
      });
    });
  };

  const cloneItem = (target: any) => {
    const clone = target.clone(true);

    const worldPosition = new THREE.Vector3();
    const worldQuaternion = new THREE.Quaternion();
    const worldScale = new THREE.Vector3();

    target.updateMatrixWorld(); // world değerleri güncelle
    target.matrixWorld.decompose(worldPosition, worldQuaternion, worldScale);

    // Bu değerleri clone'a uygula
    clone.position.copy(worldPosition);
    clone.quaternion.copy(worldQuaternion);
    clone.scale.copy(worldScale);
    return clone;
  };

  return (
    <>
      <Canvas
        camera={{
          position: [
            0.4645991127031184, 0.05203756725040587, 7.354166845337016,
          ],
          fov: 20,
          aspect: 1.4074074074074074,
          near: 0.1,
          far: 1000,
        }}
        style={{ height: "90vh", width: "90vw" }}
      >
        <primitive object={scene} />

        <CameraControls />
        <ambientLight intensity={0.75} />
        <directionalLight position={[50, 50, 50]} />
        {/*     <OrbitControls /> */}
      </Canvas>
      <div
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          width: "300px",
          minHeight: "500px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          padding: "1rem 1.2rem",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <label>Red:</label>
          <input type="radio" name="color" onInput={() => updateColor("red")} />
          <label>Blue:</label>
          <input
            type="radio"
            name="color"
            onInput={() => updateColor("blue")}
          />
          <label>Green:</label>
          <input
            type="radio"
            name="color"
            onInput={() => updateColor("green")}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "1rem",
            alignItems: "center",
            marginTop: "2rem",
          }}
        >
          <label>Height:</label>
          <input
            type="range"
            value={furniture.height}
            onInput={(e) => onUpdateHeight(e.target.value)}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "1rem",
            alignItems: "center",
            marginTop: "2rem",
          }}
        >
          <label>Width:</label>
          <input
            value={furniture.columnsCount}
            type="range"
            onInput={(e) => onUpdateColumnCount(e.target.value / 10)}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "1rem",
            alignItems: "center",
            marginTop: "2rem",
          }}
        >
          <label>Row Cout:</label>
          <input
            value={furniture.rowCount}
            type="range"
            onInput={(val) => onUpdateRowCount(val.target.value / 25)}
          />
        </div>
      </div>
    </>
  );
};
