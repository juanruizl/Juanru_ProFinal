from flask import Blueprint, jsonify, request
from api.models import db, User, Transaction, Payment, Project, Budget
from api.utils import APIException
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity


api = Blueprint('api', __name__)

# --------------------------------------------
# Rutas de Autenticación
# --------------------------------------------
@api.route('/login', methods=['POST'])
def login():
    data = request.json
    if not data.get("email") or not data.get("password"):
        raise APIException("Faltan campos obligatorios (email, password)", status_code=400)

    user = User.query.filter_by(email=data['email']).first()
    if not user or not user.check_password(data['password']):
        raise APIException("Credenciales inválidas", status_code=401)

    # Cambia el identity a string
    access_token = create_access_token(identity=str(user.id))
    return jsonify({"token": access_token, "user_id": user.id}), 200

@api.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user:
        raise APIException("Usuario no encontrado", status_code=404)

    return jsonify({"message": f"Hola, {user.name}! Esta es una ruta protegida."}), 200

# --------------------------------------------
# Rutas para Usuarios
# --------------------------------------------
# Ruta para crear un usuario (registro)
@api.route('/users', methods=['POST'])
def create_user():
    data = request.json
    if not data.get("name") or not data.get("email") or not data.get("password"):
        raise APIException("Faltan campos obligatorios (name, email, password)", status_code=400)

    # Verificar si el correo ya está registrado
    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        raise APIException("El correo ya está registrado", status_code=400)

    # Crear nuevo usuario
    new_user = User(name=data['name'], email=data['email'])
    new_user.set_password(data['password'])  # Hashear la contraseña
    db.session.add(new_user)
    db.session.commit()

    return jsonify(new_user.serialize()), 201

@api.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    users = User.query.all()
    return jsonify([user.serialize() for user in users]), 200

@api.route('/users/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    user = User.query.get(user_id)
    if not user:
        raise APIException(f"Usuario con ID {user_id} no encontrado", status_code=404)
    return jsonify(user.serialize()), 200

@api.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    current_user_id = get_jwt_identity()
    if current_user_id != user_id:
        raise APIException("No tienes permiso para eliminar este usuario", status_code=403)

    user = User.query.get(user_id)
    if not user:
        raise APIException(f"Usuario con ID {user_id} no encontrado", status_code=404)

    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": f"Usuario con ID {user_id} eliminado correctamente"}), 200

@api.route('/users/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    current_user_id = int(get_jwt_identity())
    if current_user_id != user_id:
        raise APIException("No tienes permiso para actualizar este usuario", status_code=403)

    user = User.query.get(user_id)
    if not user:
        raise APIException(f"Usuario con ID {user_id} no encontrado", status_code=404)

    data = request.json
    if 'name' in data:
        user.name = data['name']
    if 'email' in data:
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user and existing_user.id != user_id:
            raise APIException("El correo ya está registrado", status_code=400)
        user.email = data['email']
    if 'password' in data:
        user.set_password(data['password'])

    db.session.commit()
    return jsonify(user.serialize()), 200

# --------------------------------------------
# Rutas para Transacciones
# --------------------------------------------
@api.route('/transactions', methods=['POST'])
@jwt_required()
def create_transaction():
    current_user_id = get_jwt_identity()
    data = request.json
    if not data.get("amount") or not data.get("transaction_type"):
        raise APIException("Faltan campos obligatorios (amount, transaction_type)", status_code=400)

    new_transaction = Transaction(
        user_id=current_user_id,
        amount=data['amount'],
        description=data.get('description', ""),
        transaction_type=data['transaction_type']
    )
    db.session.add(new_transaction)
    db.session.commit()
    return jsonify(new_transaction.serialize()), 201

@api.route('/transactions', methods=['GET'])
@jwt_required()
def get_transactions():
    current_user_id = get_jwt_identity()
    transactions = Transaction.query.filter_by(user_id=current_user_id).all()
    return jsonify([transaction.serialize() for transaction in transactions]), 200

@api.route('/transactions/<int:transaction_id>', methods=['DELETE'])
@jwt_required()
def delete_transaction(transaction_id):
    current_user_id = get_jwt_identity()
    transaction = Transaction.query.get(transaction_id)
    if not transaction or transaction.user_id != current_user_id:
        raise APIException("Transacción no encontrada o no autorizada", status_code=404)

    db.session.delete(transaction)
    db.session.commit()
    return jsonify({"message": f"Transacción con ID {transaction_id} eliminada correctamente"}), 200

# --------------------------------------------
# Rutas para Pagos
# --------------------------------------------
@api.route('/payments', methods=['POST'])
@jwt_required()
def create_payment():
    current_user_id = get_jwt_identity()
    data = request.json
    if not data.get("amount") or not data.get("recipient"):
        raise APIException("Faltan campos obligatorios (amount, recipient)", status_code=400)

    new_payment = Payment(
        user_id=current_user_id,
        amount=data['amount'],
        recipient=data['recipient']
    )
    db.session.add(new_payment)
    db.session.commit()
    return jsonify(new_payment.serialize()), 201

@api.route('/payments', methods=['GET'])
@jwt_required()
def get_payments():
    current_user_id = get_jwt_identity()
    payments = Payment.query.filter_by(user_id=current_user_id).all()
    return jsonify([payment.serialize() for payment in payments]), 200

@api.route('/payments/<int:payment_id>', methods=['DELETE'])
@jwt_required()
def delete_payment(payment_id):
    current_user_id = get_jwt_identity()
    payment = Payment.query.get(payment_id)
    if not payment or payment.user_id != current_user_id:
        raise APIException("Pago no encontrado o no autorizado", status_code=404)

    db.session.delete(payment)
    db.session.commit()
    return jsonify({"message": f"Pago con ID {payment_id} eliminado correctamente"}), 200

# --------------------------------------------
# Rutas para Proyectos
# --------------------------------------------
@api.route('/projects', methods=['POST'])
@jwt_required()
def create_project():
    current_user_id = get_jwt_identity()
    data = request.json
    if not data.get("name"):
        raise APIException("Faltan campos obligatorios (name)", status_code=400)

    new_project = Project(
        user_id=current_user_id,
        name=data['name'],
        description=data.get('description', ""),
        start_date=data.get('start_date'),
        end_date=data.get('end_date')
    )
    db.session.add(new_project)
    db.session.commit()
    return jsonify(new_project.serialize()), 201


@api.route('/projects', methods=['GET'])
@jwt_required()
def get_projects():
    current_user_id = get_jwt_identity()
    projects = Project.query.filter_by(user_id=current_user_id).all()
    return jsonify([project.serialize() for project in projects]), 200


@api.route('/projects/<int:project_id>', methods=['GET'])
@jwt_required()
def get_project(project_id):
    current_user_id = get_jwt_identity()
    project = Project.query.get(project_id)
    if not project or project.user_id != current_user_id:
        raise APIException("Proyecto no encontrado o no autorizado", status_code=404)
    return jsonify(project.serialize()), 200


@api.route('/projects/<int:project_id>', methods=['DELETE'])
@jwt_required()
def delete_project(project_id):
    current_user_id = get_jwt_identity()
    project = Project.query.get(project_id)
    if not project or project.user_id != current_user_id:
        raise APIException("Proyecto no encontrado o no autorizado", status_code=404)

    db.session.delete(project)
    db.session.commit()
    return jsonify({"message": f"Proyecto con ID {project_id} eliminado correctamente"}), 200

@api.route('/projects/<int:project_id>', methods=['PUT'])
@jwt_required()
def update_project(project_id):
    current_user_id = int(get_jwt_identity())
    project = Project.query.get(project_id)
    if not project or project.user_id != current_user_id:
        raise APIException("Proyecto no encontrado o no autorizado", status_code=404)

    data = request.json
    if 'name' in data:
        project.name = data['name']
    if 'description' in data:
        project.description = data['description']
    if 'start_date' in data:
        project.start_date = data['start_date']
    if 'end_date' in data:
        project.end_date = data['end_date']

    db.session.commit()
    return jsonify(project.serialize()), 200

@api.route('/projects/<int:project_id>', methods=['GET'])
@jwt_required()
def get_project_details(project_id):
    current_user_id = int(get_jwt_identity())
    project = Project.query.get(project_id)
    if not project or project.user_id != current_user_id:
        raise APIException("Proyecto no encontrado o no autorizado", status_code=404)

    return jsonify(project.serialize()), 200


# --------------------------------------------
# Rutas para Presupuestos
# --------------------------------------------
@api.route('/budgets', methods=['POST'])
@jwt_required()
def create_budget():
    current_user_id = get_jwt_identity()
    data = request.json
    if not data.get("project_id") or not data.get("amount") or not data.get("status"):
        raise APIException("Faltan campos obligatorios (project_id, amount, status)", status_code=400)

    project = Project.query.get(data['project_id'])
    if not project or project.user_id != current_user_id:
        raise APIException("Proyecto no encontrado o no autorizado", status_code=404)

    new_budget = Budget(
        user_id=current_user_id,
        project_id=data['project_id'],
        amount=data['amount'],
        status=data['status']
    )
    db.session.add(new_budget)
    db.session.commit()
    return jsonify(new_budget.serialize()), 201


@api.route('/budgets', methods=['GET'])
@jwt_required()
def get_budgets():
    current_user_id = get_jwt_identity()
    budgets = Budget.query.filter_by(user_id=current_user_id).all()
    return jsonify([budget.serialize() for budget in budgets]), 200


@api.route('/budgets/<int:budget_id>', methods=['GET'])
@jwt_required()
def get_budget(budget_id):
    current_user_id = get_jwt_identity()
    budget = Budget.query.get(budget_id)
    if not budget or budget.user_id != current_user_id:
        raise APIException("Presupuesto no encontrado o no autorizado", status_code=404)
    return jsonify(budget.serialize()), 200


@api.route('/budgets/<int:budget_id>', methods=['DELETE'])
@jwt_required()
def delete_budget(budget_id):
    current_user_id = get_jwt_identity()
    budget = Budget.query.get(budget_id)
    if not budget or budget.user_id != current_user_id:
        raise APIException("Presupuesto no encontrado o no autorizado", status_code=404)

    db.session.delete(budget)
    db.session.commit()
    return jsonify({"message": f"Presupuesto con ID {budget_id} eliminado correctamente"}), 200

@api.route('/budgets/<int:budget_id>', methods=['PATCH'])
@jwt_required()
def update_budget_status(budget_id):
    current_user_id = int(get_jwt_identity())
    budget = Budget.query.get(budget_id)
    if not budget or budget.user_id != current_user_id:
        raise APIException("Presupuesto no encontrado o no autorizado", status_code=404)

    data = request.json
    if 'status' in data:
        budget.status = data['status']

    db.session.commit()
    return jsonify(budget.serialize()), 200

@api.route('/budgets/<int:budget_id>', methods=['GET'])
@jwt_required()
def get_budget_details(budget_id):
    current_user_id = int(get_jwt_identity())
    budget = Budget.query.get(budget_id)
    if not budget or budget.user_id != current_user_id:
        raise APIException("Presupuesto no encontrado o no autorizado", status_code=404)

    return jsonify(budget.serialize()), 200


