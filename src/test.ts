import '.'
import { normalizeQuestions, IProtoDefaults, IProtoQuestion, StepForm } from '.'

const $root = document.getElementById('root')

const preguntas: IProtoQuestion[] = [
  "Cómo te sientes solo?",
  "Ves Youtube muy seguido?",
  "Cómo te sientes solo?",
  "Ves Youtube muy seguido?",
  "Cómo te sientes solo?",
  "Ves Youtube muy seguido?",
  "Cómo te sientes solo?",
  "Ves Youtube muy seguido?",
  "Cómo te sientes solo?",
  "Ves Youtube muy seguido?",
  "Cómo te sientes solo?",
  "Ves Youtube muy seguido?",
  "Cómo te sientes solo?",
  "Ves Youtube muy seguido?",
  "Cómo te sientes solo?",
  "Ves Youtube muy seguido?",
  "Cómo te sientes solo?",
  "Ves Youtube muy seguido?",
  "Cómo te sientes solo?",
  "Ves Youtube muy seguido?",
  "Cómo te sientes solo?",
  "Ves Youtube muy seguido?",
  "Cómo te sientes solo?",
  "Ves Youtube muy seguido?",
  "Cómo te sientes solo?",
  "Ves Youtube muy seguido?",
  "Cómo te sientes solo?",
  "Ves Youtube muy seguido?",
  "Cómo te sientes solo?",
  "Ves Youtube muy seguido?",
  "Cómo te sientes solo?",
  "Ves Youtube muy seguido?",
  "Cómo te sientes solo?",
  "Ves Youtube muy seguido?",
  "Cómo te sientes solo?",
  "Ves Youtube muy seguido?",
  "Cómo te sientes solo?",
  "Ves Youtube muy seguido?",
  "Cómo te sientes solo?",
  "Ves Youtube muy seguido?",
]

const opcionesPorDefecto: IProtoDefaults = {
  options: [
    "Infra Bajo",
    {
      text: "Bajo"
    },
    "Medio",
    "Alto",
    "Super Alto"
  ],
}

const questions = normalizeQuestions(preguntas, opcionesPorDefecto)

const $form = document.createElement('step-form') as StepForm

$form.questions = questions
$form.title = "Hola mundo!"
$form.callbackResult = console.log

$root.appendChild($form)